const mongoose = require("mongoose");
const Classroom = mongoose.model("Classroom");

module.exports = {
  getAvailableResources: async (req, res) => {
    try {
      const availableResources = await Classroom.aggregate([
        { $unwind: "$resources" },
        { $match: { "resources.available": true } },
        { $group: { _id: "$resources.name", count: { $sum: 1 } } },
      ]);

      res.json(availableResources);
    } catch (error) {
      console.error("Erro ao obter dados dos recursos disponíveis:", error);
      res
        .status(500)
        .json({ error: "Erro ao obter dados dos recursos disponíveis" });
    }
  },

  getAlerts: async (req, res) => {
    try {
      const alerts = await Classroom.aggregate([
        { $unwind: "$alerts_manutencao" },
        {
          $project: {
            _id: 0,
            resource: "$alerts_manutencao.resource",
            descricao: "$alerts_manutencao.descricao",
          },
        },
      ]);

      res.json(alerts);
    } catch (error) {
      console.error("Erro ao obter dados dos alertas de manutenção:", error);
      res
        .status(500)
        .json({ error: "Erro ao obter dados dos alertas de manutenção" });
    }
  },

  getClassroomsResources: async (req, res) => {
    try {
      const classroomsResources = await Classroom.find(
        {},
        "courseName location resources"
      );

      res.json(classroomsResources);
    } catch (error) {
      console.error("Erro ao obter dados das salas e recursos:", error);
      res
        .status(500)
        .json({ error: "Erro ao obter dados das salas e recursos" });
    }
  },

  getRoomAlerts: async (req, res) => {
    try {
      const roomAlerts = await Classroom.find(
        { "alerts_manutencao.0": { $exists: true } },
        "courseName location alerts_manutencao"
      );

      res.json(roomAlerts);
    } catch (error) {
      console.error("Erro ao obter salas com alertas de manutenção:", error);
      res
        .status(500)
        .json({ error: "Erro ao obter salas com alertas de manutenção" });
    }
  },

  getClassroomsHistory: async (req, res) => {
    try {
      const classroomsHistory = await Classroom.aggregate([
        { $unwind: "$history" },
        {
          $group: {
            _id: "$_id",
            courseName: { $first: "$courseName" },
            location: { $first: "$location" },
            history: { $push: "$history" },
          },
        },
      ]);

      res.json(classroomsHistory);
    } catch (error) {
      console.error("Erro ao obter histórico de utilização das salas:", error);
      res
        .status(500)
        .json({ error: "Erro ao obter histórico de utilização das salas" });
    }
  },

  getStatistics: async (req, res) => {
    try {
      const avgResourcesPerRoom = await Classroom.aggregate([
        { $match: { resources: { $exists: true } } }, // Filtra os documentos com o campo 'resources'
        { $project: { _id: 0, resourcesCount: { $size: "$resources" } } },
        { $group: { _id: null, avgResources: { $avg: "$resourcesCount" } } },
      ]);

      const avgOccupancyRate = await Classroom.aggregate([
        { $unwind: "$history" },
        {
          $group: {
            _id: "$_id",
            totalUsage: { $sum: "$history.duration" },
            totalCapacity: { $first: "$capacity" },
          },
        },
        {
          $group: {
            _id: null,
            avgOccupancyRate: {
              $avg: { $divide: ["$totalUsage", "$totalCapacity"] },
            },
          },
        },
      ]);

      const statistics = {
        avgResourcesPerRoom: avgResourcesPerRoom.length
          ? avgResourcesPerRoom[0].avgResources
          : 0,
        avgOccupancyRate: avgOccupancyRate.length
          ? avgOccupancyRate[0].avgOccupancyRate
          : 0,
      };

      res.json(statistics);
    } catch (error) {
      console.error("Erro ao obter estatísticas:", error);
      res.status(500).json({ error: "Erro ao obter estatísticas" });
    }
  },
  getOverview: async (req, res) => {
    try {
      const totalClassrooms = await Classroom.countDocuments();

      // Restante do código para calcular as informações da visão geral

      const overviewData = {
        totalClassrooms,
        // Demais informações calculadas aqui
      };

      res.json(overviewData);
    } catch (error) {
      console.error("Erro ao obter dados da visão geral:", error);
      res.status(500).json({ error: "Erro ao obter dados da visão geral" });
    }
  },
};
