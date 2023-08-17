//a simple route handler
const express = require("express");
const router = express.Router();
const classroomController = require("../controllers/classroomController");
/**
 * @swagger
 * /classrooms:
 *   get:
 *     summary: Retorna todas as salas
 *     tags: [Classrooms]
 *     responses:
 *       200:
 *         description: Retorna a lista de todas as salas
 *       500:
 *         description: Erro no servidor
 */
router.get("/", classroomController.classroom_list);
router.get("/:id", classroomController.classroom_detail);
/**
 * @swagger
 * /classrooms:
 *   post:
 *     summary: Cria uma nova sala
 *     tags: [Classrooms]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               courseName:
 *                 type: string
 *               semester:
 *                 type: string
 *               location:
 *                 type: string
 *     responses:
 *       201:
 *         description: Sala criada com sucesso
 *       500:
 *         description: Erro no servidor
 */

router.post("/", classroomController.classroom_create);
/**
 * @swagger
 * /classrooms/{id}:
 *   put:
 *     summary: Atualiza uma sala existente
 *     tags: [Classrooms]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da sala a ser atualizada
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               courseName:
 *                 type: string
 *               semester:
 *                 type: string
 *               location:
 *                 type: string
 *     responses:
 *       200:
 *         description: Sala atualizada com sucesso
 *       500:
 *         description: Erro no servidor
 */
router.put("/:id", classroomController.classroom_update);
/**
 * @swagger
 * /classrooms/{id}:
 *   delete:
 *     summary: Deleta uma sala existente
 *     tags: [Classrooms]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da sala a ser deletada
 *     responses:
 *       200:
 *         description: Sala deletada com sucesso
 *       500:
 *         description: Erro no servidor
 */
router.delete("/:id", classroomController.classroom_delete);
/**
 * @swagger
 * /search:
 *   get:
 *     summary: Pesquisa salas por nome do curso, semestre ou localização
 *     tags: [Classrooms]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Texto de pesquisa
 *     responses:
 *       200:
 *         description: Retorna a lista de salas que correspondem à pesquisa
 *       500:
 *         description: Erro no servidor
 */
router.get("/search", classroomController.classroom_search);
module.exports = router;
