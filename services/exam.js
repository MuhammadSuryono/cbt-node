const db = require('./db')

const allTypeExam = async () => {
    const typeExams = await db.query(
        `SELECT * FROM type_exam`
    );

    return typeExams
}

const categoryByTypeExam = async (typeExamId) => {
    const category = await db.query(
       `SELECT * FROM category_question WHERE type_exam_id = '${typeExamId}'`
    );

    return category
}

const listQuestionCategory = async (categoryId) => {
    const listQuestion = await db.query(
        `SELECT * FROM list_question WHERE question_category_id = '${categoryId}'`
    );

    return listQuestion
}

const countTotalCorrect = async (lisQuestionId, registerNumber) => {
    const examResult = await db.query(
        `SELECT COUNT(a.id) as total FROM exam_result a 
    JOIN exam_question b ON a.exam_question_id = b.id AND a.value = b.answer
    WHERE b.list_question_id = '${lisQuestionId}' AND a.number_register = '${registerNumber}'`
    );

    return examResult[0]
}

module.exports = {
    allTypeExam,
    categoryByTypeExam,
    listQuestionCategory,
    countTotalCorrect
}