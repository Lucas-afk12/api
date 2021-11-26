"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MangaModel = void 0;
/* eslint linebreak-style: ["error", "windows"] */
const mongoose_1 = require("mongoose");
const autoIncrement = require('mongoose-auto-increment');
const connection = (0, mongoose_1.createConnection)('mongodb+srv://Lucas:Salmeron1@cluster0.athzv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');
const MangaSchema = new mongoose_1.Schema({
    _id: { type: Number },
    Datos: { type: Object },
    Personal: { type: Object },
    Tags: { type: Array },
    tipo: { type: String },
    apiID: { type: String },
});
autoIncrement.initialize(connection);
MangaSchema.plugin(autoIncrement.plugin, 'Mangas');
exports.MangaModel = connection.model('Mangas', MangaSchema);
