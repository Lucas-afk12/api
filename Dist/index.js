"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-undef */
/* eslint-disable no-console */
/* eslint linebreak-style: ["error", "windows"] */
const axios_1 = __importDefault(require("axios"));
const Manga_1 = require("./models/classes/Manga");
const MangaModel_1 = require("./models/MangaModel");
// datos del manga
const main = async () => {
    const GetMangaFromApi = async () => {
        let Info = [];
        const Mangas = [];
        let Artista = '';
        let Autor = '';
        let Imagen = '';
        for (let x = 0; x < 5;) {
            for (let i = 0; i <= 9;) {
                // eslint-disable-next-line no-await-in-loop
                // eslint-disable-next-line no-loop-func
                await axios_1.default.get(`https://api.mangadex.org/manga?includes[]=cover_art&includes[]=author&includes[]=artist&limit=100&offset=${x}${i}00`).then((res) => {
                    Info.push(res.data.data);
                    console.log(`${x}${i}00 cargado`);
                });
                i += 1;
            }
            x += 1;
        }
        Info = Info.flat(1);
        Info.forEach((Manga) => {
            let Personal;
            const Datos = {
                ultimoVolumen: Manga.attributes.lastVolume,
                ultimoCapitulo: Manga.attributes.lastChapter,
                contentRating: Manga.attributes.contentRating,
                fechaCreacion: Manga.attributes.createdAt,
                fechaActualizacion: Manga.attributes.updatedAt,
                titulo: Manga.attributes.title.en,
                genero: Manga.attributes.publicationDemographic,
                estado: Manga.attributes.state,
            };
            Manga.relationships.forEach((relaciones) => {
                if (relaciones.attributes !== undefined) {
                    if (relaciones.type === 'artist') {
                        Artista = relaciones.attributes.name;
                    }
                    if (relaciones.type === 'author') {
                        Autor = relaciones.attributes.name;
                    }
                    if (relaciones.type === 'cover_art') {
                        Imagen = relaciones.attributes.fileName;
                    }
                }
                const objects = {
                    artista: Artista,
                    autor: Autor,
                    imagen: Imagen,
                };
                Personal = objects;
            });
            const [tags] = Manga.attributes.tags;
            const tipo = Manga.type;
            const ApiID = Manga.id;
            const manga = new Manga_1.TrueManga(Datos, Personal, tags, tipo, ApiID);
            manga.instCover();
            Mangas.push(manga);
        });
        let a = 0;
        await Promise.all(Mangas.map(async (Manga) => {
            const saver = new MangaModel_1.MangaModel(Manga);
            await saver.save().then(() => console.log(`manga ${a} guardado`));
            a += 1;
        }));
        console.log('terminado');
    };
    const checker = [1010, 2106, 3252, 4211, 4100];
    const checkValues = [];
    // await Promise.all(checker.map(async (x) => {
    //   console.log(x);
    //   await checkValues.push(await MangaModel.findOne({ 'Datos.titulo': { $eq: 'Naruto' } }));
    // }));
    // if (checkValues.length <= 3) {
    //   GetMangaFromApi();
    // }
    const user = {
        username: 'Lucasc12',
        password: 'Salmeron1-',
        email: 'lucascoronilla@hotmail.com',
    };
    let token = '';
    await axios_1.default.post('https://api.mangadex.org/auth/login', user).then((res) => token = res.data.token.session).catch((err) => console.log(err.response.data));
    await axios_1.default.get(`https:uploads.mangadex.org:112/${token}/data/cc4c0e47e11e0cd39946fac54646f554/G1-829c1ccfa15de3804897b6d599f544d2540031839ae781117acffc54f10bb94d.png`).then((res) => console.log(res)).catch((err) => console.log(err));
};
main();
