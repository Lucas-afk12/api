/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-undef */
/* eslint-disable no-console */
/* eslint linebreak-style: ["error", "unix"] */
import axios, { AxiosRequestHeaders } from 'axios';
import jwt_decode from 'jwt-decode';
import { TrueManga, personal, MangaData } from './models/classes/Manga';
import { MangaModel } from './models/MangaModel';

// datos del manga
const main = async () => {
  const GetMangaFromApi = async () => {
    let Info : any[] = [];
    const Mangas : TrueManga[] = [];
    let Artista = '';
    let Autor = '';
    let Imagen = '';
    for (let x = 0; x < 5;) {
      for (let i = 0; i <= 9;) {
      // eslint-disable-next-line no-await-in-loop
      // eslint-disable-next-line no-loop-func
        await axios.get<TrueManga[]>(`https://api.mangadex.org/manga?includes[]=cover_art&includes[]=author&includes[]=artist&limit=100&offset=${x}${i}00`).then((res:any) => {
          Info.push(res.data.data);
          console.log(`${x}${i}00 cargado`);
        });
        i += 1;
      }
      x += 1;
    }
    Info = Info.flat(1);
    Info.forEach((Manga) => {
      let Personal: any;
      const Datos: MangaData = {
        ultimoVolumen: Manga.attributes.lastVolume,
        ultimoCapitulo: Manga.attributes.lastChapter,
        contentRating: Manga.attributes.contentRating,
        fechaCreacion: Manga.attributes.createdAt,
        fechaActualizacion: Manga.attributes.updatedAt,
        titulo: Manga.attributes.title.en,
        genero: Manga.attributes.publicationDemographic,
        estado: Manga.attributes.state,
      };
      Manga.relationships.forEach((relaciones: any) => {
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
        const objects : personal = {
          artista: Artista,
          autor: Autor,
          imagen: Imagen,

        };
        Personal = objects;
      });
      const [tags] = Manga.attributes.tags;
      const tipo = Manga.type;
      const ApiID = Manga.id;
      const manga = new TrueManga(Datos, Personal, tags, tipo, ApiID);
      manga.instCover();
      Mangas.push(manga);
    });
    let a = 0;

    await Promise.all(Mangas.map(async (Manga) => {
      const saver = new MangaModel(Manga);
      await saver.save().then(() => console.log(`manga ${a} guardado`));
      a += 1;
    }));
    console.log('terminado');
  };

  // const checker = [1010, 2106, 3252, 4211, 4100];
  // const checkValues: Array<any> = [];
  // await Promise.all(checker.map(async (x) => {
  //   console.log(x);
  //   await checkValues.push(await MangaModel.findOne({ 'Datos.titulo': { $eq: 'Naruto' } }));
  // }));
  // if (checkValues.length <= 3) {
  //   GetMangaFromApi();
  // }
  // console.log(checkValues)
  const user = {
    username: 'Lucasc12',
    password: 'Salmeron1-',
  };
  let token : any = '';
  let baseURL : string = '';

  await axios.post('https://api.mangadex.org/auth/login', user).then((res) => token = `${res.data.token.session}`).catch((err) => console.log(err.response.data));
  await axios.get('https://api.mangadex.org/auth/check', {
    headers: {
      authorization: `bearer ${token}`,
    },
  });

  await axios.get('https://api.mangadex.org/at-home/server/ca2c5daa-d7b9-4ff7-9af5-b24966c18a4f', {
    headers: {
      authorization: `bearer ${token}`,
    },
  }).then((res) => baseURL = res.data.baseUrl);
  console.log(`${baseURL}/data-saver/901a558099f665e664a29ac63c713c71/s2-6782fe3379ea45b94afa2…527507ca4ad80709a01.jpg`);

  await axios.get(`${baseURL}/data/901a558099f665e664a29ac63c713c71/s3-526efa4d0c5a92f84e112bf243b83af8cc79b7644e7ee68d62942553ef463a70.jpg`, {
    headers: {
      authorization: `bearer ${token}`,
    },
  }).then((res) => );
};
main();
