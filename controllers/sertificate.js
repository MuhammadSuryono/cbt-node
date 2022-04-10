const qUser = require("../services/user");
const {allTypeExam, categoryByTypeExam, listQuestionCategory, countTotalCorrect} = require("../services/exam");
const dictScore = require("../templates/dict-reward-exam.json")
const pdf = require("./pdf-generator");
const qrCode = require("qrcode");
const fs = require("fs");

const getCountTotalCorrect = async (registerNumber, typeExamId) => {
    const category = await categoryByTypeExam(typeExamId)
    const listQuestion = await listQuestionCategory(category[0].id)

    let totalCorrect = 0
    for (const item of listQuestion) {
        let countTotal = await countTotalCorrect(item.id, registerNumber)
        totalCorrect += countTotal.total
    }

    return totalCorrect
}

const resultExam = async (registerNumber, typeExam) => {
    const totalCorrect = await getCountTotalCorrect(registerNumber, typeExam.id)
    let typeExamId = typeExam.id

    return {
        type_exam: typeExam.type,
        total_correct: totalCorrect,
        total_score: dictScore[typeExamId][totalCorrect]
    }
}

const sertificate = async (req, res, next) => {
    const registerNumber = req.query.registerNumber;
    try {
        console.log("Get Data User")
        const user = await qUser.getDataUser(registerNumber);
        if (user.length === 0) res.status(404).json({message: "User Not Found"})

        console.log("Get Data Type Exam")
        const typeExams = await allTypeExam();
        let examResults = [];
        let totalScore = 0;
        console.log("Get Result Exam")
        for (const typeExam of typeExams) {
            const result = await resultExam(registerNumber, typeExam);
            totalScore += result.total_score
            examResults.push(result)
        }

        const dataQr = await qrCode.toDataURL(user.number_of_register)

        console.log("Generate PDF")
        let data = {
            user: user,
            exam_result: examResults,
            total_score: (totalScore / 3) * 10,
            qr_code: dataQr
        }
        await pdf.generate(registerNumber, data)

        const file = fs.readFileSync(`./output/${user.number_of_register}.pdf`)
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=${user.number_of_register}.pdf`);
        res.send(file)

    } catch (err) {
        console.error(`Error while generate sertificate on `, err.message);
        next(err);
    }
}

module.exports = {
    sertificate
}