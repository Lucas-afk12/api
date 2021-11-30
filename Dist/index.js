"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-undef */
/* eslint-disable no-console */
/* eslint linebreak-style: ["error", "unix"] */
const axios_1 = __importDefault(require("axios"));
const Manga_1 = require("./classes/Manga");
const MangaModel_1 = require("./models/MangaModel");
const GetMangaFromApi = async () => {
    let Info = [];
    const Mangas = [];
    let Artista = '';
    let Autor = '';
    let Imagen = '';
    for (let x = 3; x < 4;) {
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
    return Mangas;
};
const getChaptersFromApi = async () => {
    const apiID = await MangaModel_1.MangaModel.find({}).select({ apiID: 1 });
    const chapter = [];
    for await (const id of apiID) {
        await axios_1.default.get(`https://api.mangadex.org/manga/${id.apiID}/aggregate`).then((res) => { chapter.push(res.data); console.log(`guardado capitulos del manga ${id._id}`); }).catch((err) => { console.log('manga fallido'); });
    }
    console.log(chapter);
};
const main = async () => {
    const checker = [1010, 500, 1600, 270, 610];
    const checkValues = [];
    let x = 0;
    await Promise.all(checker.map(async (x) => {
        await checkValues.push(await MangaModel_1.MangaModel.findOne({ _id: { $eq: x } }));
    }));
    checkValues.forEach((error) => { if (error === null) {
        x += 1;
    } });
    if (x > 3) {
        await GetMangaFromApi();
    }
    await getChaptersFromApi();
    // await querysToapi.login();
    // await querysToapi.checkSession();
};
main();
