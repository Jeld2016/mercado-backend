const { Router } = require('express');
const router = Router();
const cheerio = require('cheerio')
var unirest = require('unirest');
const mysql = require('mysql');
var moment = require('moment'); // require
const axios = require('axios'); // Alternativa a Unirest
const FormData = require("form-data");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const os = require("os");
const bodyParser = require('body-parser'); // Para manejar el cuerpo de las solicitudes
const puppeteer = require('puppeteer');

const stringList = [
    "ikea", "skip hop", "seresto", "ayara", "purple dragon", "amazon", "sparco", "nyko",
  "higherbros", "tissot", "contour", "bulbhead", "ergobaby", "wonder care", "nutri bullet",
  "finishing touch", "sony", "pioneer", "amazonbasics", "amazon basics", "fridababy", 
  "frida baby", "russell hobbs", "russellhobbs", "ontel", "hikivision", "camera cctv", 
  "cameracctv", "nike", "jordan", "adidas", "tommy", "tommyhilfiger", "tommy hilfiger", 
  "umbra", "king life", "kinglife", "amiter", "casemartusa", "casemart usa", "skiphop", 
  "purpledragon", "wondercare", "nutribullet", "finishingtouch", "simplehuman", 
  "simple human", "magic bullet", "magicbullet", "tijeras", "medela", "skullcandy", 
  "clocky", "runaway", "mattel", "xbox", "panasonic", "nintendo", "playstation", 
  "microsoft", "samsung", "protein", "whey", "isolate", "gogogo sport vpro store", 
  "gogogo", "frida mom", "apple", "bang & olufsen", "swatch", "chuwi", "corel", 
  "pistola", "taser", "paralizante", "paralizador", "proteina", "creatina", 
  "suplemento", "armas", "pistolas", "dreamlab", "dream lab", "ray ban", "rayban", 
  "aviator", "higherbro", "fridamom", "decodificador", "antena", "ray-ban", "oakley", 
  "vogue", "arnette", "e.l.f.", "barberpub", "lanzador", "dyson", "mismon", "disney", 
  "tuko", "hoffmaster", "petstages", "minecraft", "clinique", "astroai", "motorola", 
  "loop", "loop earplugs", "elanco", "arctic air", "prada", "wonder core", 
  "skull candy", "play station", "cocomelon", "philips", "renpho", "fat brain toys", 
  "thinkwork", "blippi", "satechi", "misognare", "Crayola", "philips norelco", 
  "carpet", "runaway", "clinica", "lerine", "MATEIN", "Gloria", "Barbie", "Umilife", 
  "Omie", "Tabla de cortar", "Xia Home Fashions", "DA VINCI", "Jjfun", "Boppy", 
  "Zacurate", "Pulsioxímetro", "Oxímetro", "WHAT DO YOU MEME", "Iconic Floats", 
  "Almohada De Lactancia", "Irrigador", "nebulizador", "Inspirometro", 
  "Ejercitador Pulmonar", "Ortopédica", "Ortopédico", "Ferula", "termomentros", 
  "Glucómetro", "Tanque De Oxigeno", "BONAOK", "Hfuear", "Dericam", "iPad", 
  "Anivia", "JSAUX", "Windows", "iPhone", "bose", "kensington", "macbook", 
  "dragón nuance", "invicta", "humble crew", "humblecrew", "Google", "AMAFACE", 
  "Gamma", "airpod", "Gowall", "macbooks", "macbook", "ZenToes", "Bieye", 
  "Ezyroller", "ASUS", "Elevation Lab", "s&a woodcraft", "Geomag", "Lizze", 
  "Sunlit", "Best Friends by Sheri", "SUOSDEY", "Optics Vanquish", "Vortex optics", 
  "Lightbiz", "FreedConn", "Polaroid", "Delta faucet", "Delta", "USCAMEL", "Capstar", 
  "Advanllent", "pulgas", "garrapatas", "Outward Hound", "OutwardHound", "Simicoo", 
  "Star Shower", "Lack", "I-K-E-A", "Thule", "Renpho", "BXST", "occiam", 
  "Rhode Island", "EdMaxwell", "Delta Faucet", "Dorai", "Ysirseu", "WiberWi", 
  "OriGlam", "Earrock", "CONTROL KITCHEN", "Tupper", "Vickerman", "Kraus", 
  "MarineLand", "Tetra", "Whisper", "Durvet", "Unyoke", "KYMELLIE", "PZAS Toys", 
  "Audifonos", "mochilas", "mochila","Mochila", "maletin", "bmani", "Stomp Rocket", "TAYGEER", 
  "YTONET", "Hide & Scratch", "Emvency", "Tayney", "Rascador Y Tumbona", 
  "funda laptop", "estuche laptop", "carpeta laptop", "rifle", "tiro", "caza", 
  "cazar", "cazador", "optico", "optica", "tactico", "tactica", "visor", "tanque", 
  "aleman", "telescopico", "laser", "mira", "navaja", "cuchillo", "cuchilla", 
  "destructor", "velico", "guerra", "mundial", "panzer", "combate", "ataque", 
  "holográfica", "Lente", "Fusil", "Cacería", "Militar", "Cartucho", "Tirador", 
  "Precisión", "Disparo", "Munición", "shoot", "shooting", "Airsoft", "infrarrojas", 
  "punto rojo", "punto verde", "montura", "espadas", "paintball", "Arcos", 
  "flechas", "Battleship", "Retícula", "Military", "Reflex Optic", "Red Dot", 
  "George Foreman"
  ];

// Middleware para parsear el cuerpo de las solicitudes
router.use(bodyParser.urlencoded({ extended: true }));

const db = mysql.createConnection({
    host: '86.38.202.103',
    user: 'u443699343_mercado',
    password: 'Tokio123%#$',
    database: 'u443699343_API_MERCADO'
  });

const proxyConfig = {
    host: "geo.iproyal.com",
    port: 12321, // Puerto asignado
    auth: {
        username: "vtXjnTNfJmZn92fs", // Usuario del proxy
        password: "mk80G9h5Ro9TxRgt_country-us_city-laredo" // Contraseña del proxy
    }
};

//accessToken = 'APP_USR-5074710933028386-100122-d2593a3a62faa4229eb665e5612c0642-1737844049';
// const accessToken = "APP_USR-1199660678088357-121101-3d693a8c1c08f4761213716ed7172809-1737844049";
// refreshToken = 'TG-66fa1579f4032f00013bd0ca-1737844049';

let myHeaders = new Headers();
const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer APP_USR-5074710933028386-121123-263c725b176c39cc98cf18dffe47c9f1-1737844049`,
};
const urlencoded = new URLSearchParams();


//---------------------------------------------------Funciones Mercado Libre-------------------------------------------------------------------

/*Funcion para iniciar el login desde el frontend el iniciar tienda busca si existe token activo
En caso de existir toma el valor y los establece en los headers, si no debe generar un nuevo token
almacenarlo y cargarlo en los heades.
Parameros: tienda - nombre de la tienda */
router.get('/iniciar/:tienda', async (req, res) => {    
  const {tienda} = req.params;
  myHeaders = new Headers();
  db.query('SELECT * FROM clientes where tienda = ?', [tienda],
    (err, result) => {
        if (err) {
            console.error('Error executing query: ' + err.stack);
            return;
        }
        const resultado = result[0]

        const ultima_conexion = moment(resultado.ultima_peticion);
        const ahora = moment();
        if(ahora.diff(ultima_conexion,"hours") <= 6)
            setHeaders(resultado.access_token);
        else
            getToken(resultado.client_id,resultado.client_secret,resultado.refresh_token);
         res.json({message: "Consulta exitosa"});
    });    
 
})

/*Funcion para realizar una busqueda por tienda su funcion al igual que iniciar es buscar si existe un accesstoken
en caso de existir lo establece si no obtiene el nuevo token lo debe almacenar y agregar al headers  */
async function findDataShop(tienda){
db.query('SELECT * FROM clientes where seller_id = ?', [tienda],
  (err, result) => {
      if (err) {
          console.error('Error executing query: ' + err.stack);
          return false;
      }
      const resultado = result[0]
      if(result.length >= 1){
      const ultima_conexion = moment(resultado.ultima_peticion);
      const ahora = moment();
      if(ahora.diff(ultima_conexion,"hours") <= 6)
          setHeaders(resultado.access_token);
      else
          getToken(resultado.client_id,resultado.client_secret,resultado.refresh_token);
      }
      return true;
  });
  
}

/*Crea una nueva instancia de Headers con el token que se le envia
Parametro: Token */
function setHeaders(token){
  myHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
  // myHeaders = new Headers();
  // myHeaders.append("Content-Type", "application/json");
  // myHeaders.append("Authorization", `Bearer ${token}`);
  // config = { myHeaders}
  return true;
}

/*Funcion para obtener un nuevo token de mercado libre
Parametros: client_id- variable requerida para obtener el token
client_secret- variable requerida para obtener el token
refresh_token- variable requerida para obtener el token*/
async function getToken(client_id,client_secret,refresh_token){    
myHeaders = new Headers();
  myHeaders.append("accept", "application/json");
  myHeaders.append("content-type", "application/x-www-form-urlencoded");
  
  urlencoded.append("grant_type", "refresh_token");
  urlencoded.append("client_id", client_id);
  urlencoded.append("client_secret", client_secret);
  urlencoded.append("refresh_token", refresh_token); 
  config = { myHeaders }
  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: urlencoded,
    redirect: "follow"
  };

    fetch("https://api.mercadolibre.com/oauth/token", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      const  resultado = result;
      setHeaders(resultado.access_token);
      const ahora = new Date();
      db.query('UPDATE clientes SET access_token = ?, ultima_peticion = ? where client_id = ?', [resultado.access_token,ahora,client_id],
      (err, result) => {
          if (err) {
              console.error('Error executing query: ' + err.stack);
          }
      });
  })
    .catch((error) => console.error(error));

}

 /* Función para predecir categoría
 parametros: titulo - valor para predecir la categoria
 return: categoria obtenida
 */
 async function predictorCategoria(titulo) {
  const url = `https://api.mercadolibre.com/sites/MLM/domain_discovery/search?limit=1&q=${encodeURIComponent(titulo)}`;
  
  try {
    const response = await axios.get(url, myHeaders);
    return response.data[0]?.category_id;
  } catch (error) {
    throw error;
  }
}

/* Obtiene los atributos de una categoría 
parametro: categoria - categoria devuelta en el predictor
return datos filtrados de la busqueda
*/
async function obtenerAtributos(categoria) {
  const url = `https://api.mercadolibre.com/categories/${categoria}/attributes`;

  try {
    const response = await axios.get(url, myHeaders);
    // Filtrar atributos requeridos o condicionalmente requeridos
    let atributos = response.data
      .filter(attr => attr.tags?.required || attr.tags?.conditional_required)
      .map(attr => ({
        id: attr.id,
        name: attr.name,
        required: attr.tags?.required || false,
        conditional_required: attr.tags?.conditional_required || false,
        value_name: attr.name 
      }));

        const gtinAtributo = atributos.find(attr => attr.id === "GTIN");
    if (gtinAtributo) {
      const marca = atributos.find(attr => attr.id === "BRAND");
      if (marca) { // Verifica si se encontró la marca
        marca.value_name = "brand";
      }
      const indice = atributos.findIndex(attr => attr.id === "GTIN");
      atributos.splice(indice, 1);
    }

    const emptyGtinReasonAtributo = atributos.find(attr => attr.id === "EMPTY_GTIN_REASON");
    
    // Si el atributo EMPTY_GTIN_REASON ya está en la lista
    if (emptyGtinReasonAtributo) {
      emptyGtinReasonAtributo.value_id = "17055160";
      emptyGtinReasonAtributo.value_name = "El producto no tiene código registrado";
    }

    const unidadesPorPack = atributos.find(attr => attr.id === "UNITS_PER_PACK");
    if (unidadesPorPack) {
      unidadesPorPack.value_name = 1;
    }

    return atributos;

  } catch (error) {
    console.error("Error al obtener atributos:", error);
    throw error;
  }
}

/* Función para obtener el nombre de la categoria*/
async function getCategoryName(categoryId) {
  const url = `https://api.mercadolibre.com/categories/${categoryId}`;
  try {
      const response = await fetch(url);
      if (!response.ok) {
          throw new Error(`Error al obtener la categoría: ${response.status}`);
      }

      const data = await response.json();
      console.log("nombre", data.name)
      return data.name; // El nombre de la categoría está en la propiedad "name"
  } catch (error) {
      console.error("Error:", error);
      return null;
  }
}
  
/* Función para publicar un producto 
Parametro: producto -  producto a publicar*/
  /*async function publicarProducto(producto) {
    const publicacion = {
      title: producto.title.slice(0, 60),
      category_id: producto.category,
      price: producto.price,
      currency_id: "MXN",
      available_quantity: 12,
      buying_mode: "buy_it_now",
      condition: "new",
      listing_type_id: "gold_pro",
      pictures: producto.image ,
      attributes: [
        ...producto.atributos.atributos,
        { id: "SELLER_SKU", value_name: producto.sku }
      ]
    };
  
    const urlPublicar = "https://api.mercadolibre.com/items";
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer APP_USR-5917059908375656-102523-8cbc31256330be8002261aadb55efa30-294778461`
    };
  
    try {
      const response = await axios.post(urlPublicar, publicacion, {headers} );
      const publicacionId = response.data.id; // Obtener el ID de la publicación
  
      // await agregarDescripcionProducto(publicacionId, producto);
  
      const saleTerms = {
        sale_terms: [
          {
            id: "MANUFACTURING_TIME",
            value_name: `${producto.diasDisponibilidad} días`
          }
        ]
      };
  
      // Hacer la solicitud PUT para actualizar los términos de venta
      const urlUpdate = `https://api.mercadolibre.com/items/${publicacionId}`;
      const updateResponse = await fetch(urlUpdate, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer APP_USR-5917059908375656-102523-8cbc31256330be8002261aadb55efa30-294778461`
        },
        body: JSON.stringify(saleTerms)
      });
  
      const result = await updateResponse.text();
      
    } catch (error) {
      if (error.response) {
        console.error("Error en la respuesta de la API:", error.response.data);
      } else if (error.request) {
        console.error("No hubo respuesta de la API:", error.request);
      } else {
        console.error("Error en la configuración de la solicitud:", error.message);
      }
      throw error;
    }
  }*/  
    const publicarProducto = async (producto) => {
      try {
        // Validar palabras prohibidas en el título y descripción
        const contieneProhibidas = await palabrasProhibidas(`${producto.title} ${producto.description}`);
        if (contieneProhibidas) {
          console.error("Se encontraron palabras prohibidas en el título o la descripción.");
          throw new Error("Proceso detenido: Contenido prohibido detectado en el producto.");
        }
    
        const uploadedImages = [];
    
        // Procesar cada imagen del producto
        for (const [index, imageUrl] of producto.image.entries()) {
          console.log(`Procesando imagen ${index + 1}: ${imageUrl}`);
    
          // Verificar el tamaño de la imagen desde la URL
          const esValida = await verificarTamanoImagen(imageUrl, index);
          if (!esValida) {
            console.log(`La imagen ${imageUrl} no cumple con el tamaño mínimo requerido.`);
            continue; // Ignorar imágenes no válidas
          }
    
          // Agregar imagen válida a la lista
          uploadedImages.push({ source: imageUrl });
        }
    
        if (uploadedImages.length === 0) {
          throw new Error("Ninguna imagen válida para publicar el producto.");
        }
    
        const atributosLimpios = producto.atributos.atributos.map((atributo) => {
          const { id, value_name, value_id } = atributo;
          return { id, value_name, value_id }; // Solo incluir las claves válidas
        }).filter(attr => attr.id && (attr.value_name || attr.value_id));
        
        const publicacion = {
          title: producto.title.slice(0, 60),
          category_id: producto.category,
          price: producto.price,
          currency_id: "MXN",
          available_quantity: 12,
          buying_mode: "buy_it_now",
          condition: "new",
          listing_type_id: "gold_pro",
          pictures: uploadedImages, // Usar imágenes validadas
          attributes: [
            ...atributosLimpios,
            { id: "SELLER_SKU", value_name: producto.sku },
          ],
        };
    
        // Publicar el producto
        const urlPublicar = "https://api.mercadolibre.com/items";
        const response = await axios.post(urlPublicar, publicacion, { headers });
        const publicacionId = response.data.id; // ID de la publicación
        console.log("Producto publicado con éxito, ID:", publicacionId);
        
        await agregarDescripcionProducto(publicacionId, producto);
        // Actualizar términos de venta
        const saleTerms = {
          sale_terms: [
            {
              id: "MANUFACTURING_TIME",
              value_name: `${producto.diasDisponibilidad} días`,
            },
          ],
        };
    
        const urlUpdate = `https://api.mercadolibre.com/items/${publicacionId}`;
        await axios.put(urlUpdate, saleTerms, { headers });
        console.log("Términos de venta actualizados correctamente");
    
      } catch (error) {
        if (error.message.includes("Contenido prohibido")) {
          console.error("El proceso se detuvo debido a contenido prohibido.");
        } else if (error.response) {
          console.error("Error en la respuesta de la API:", error.response.data);
        } else if (error.request) {
          console.error("No hubo respuesta de la API:", error.request);
        } else {
          console.error("Error en la configuración de la solicitud:", error.message);
        }
        throw error; // Rethrow para manejarlo externamente si es necesario
      }
    };

    async function agregarDescripcionProducto(itemId, producto) {
      // Crear el cuerpo de la solicitud para la descripción
      const descripcion = {
        plain_text: producto.description // Tomar la descripción desde el objeto producto
      };
    
      const urlDescripcion = `https://api.mercadolibre.com/items/${itemId}/description`;
    
      // Realizar la solicitud POST para agregar la descripción
      try {
        const response = await fetch(urlDescripcion, {
          method: "POST",
          headers: headers,
          body: JSON.stringify(descripcion),
          redirect: "follow"
        });
    
        const result = await response.text();
        console.log("Descripción agregada:", result);
      } catch (error) {
        console.error("Error al agregar la descripción:", error);
      }
    }

  /*Funcion para obtener la lista d eproductos de mercado Libre */
  router.get('/lista/:id', async (req,res)=> {
    const {id} = req.params;
    findDataShop(id)
    setTimeout(async () => {
      let response = await fetch(`https://api.mercadolibre.com/users/${id}/items/search?search_type=scan&limit=100&status=active`,{method: "GET",headers: myHeaders});
      let data = await response.json()
      let resultados = data.results;
      
          let productos = [];
          for(let i=0; i < resultados.length; i++){
              const consulta = await fetch(`https://api.mercadolibre.com/items?ids=${resultados[i]}`,{method: "GET",headers: myHeaders});
              const producto = await consulta.json()
              let dias_entrega = 0;
              let SKU = producto[0].body.seller_custom_field;
              if(!SKU || SKU == null || SKU == "")
                {
                  const atributo = producto[0].body.attributes.find(obj =>  obj.id == 'SELLER_SKU');
                  if(atributo){
                    SKU = atributo.value_name;
                  }
                }
                
              if(isNaN(producto[0].body.sale_terms[0].value_name.split(' días')[0]))
                dias_entrega = Number(producto[0].body.sale_terms[0].value_name.split(' días')[0])
              const item = {ID_product: producto[0].body.id, dias_entrega: dias_entrega, title: producto[0].body.title, price: producto[0].body.price, category_id: producto[0].body.category_id, available_quantity: producto[0].body.available_quantity, image: producto[0].body.thumbnail, seller_custom_field: SKU}

              if(SKU && SKU != null && SKU != "")
              productos.push(item);
          }
          let scroll = data.scroll_id;
          let resultado = { scroll_id: scroll, productos}
          res.json(resultado);
    }, 1000);
    // return productos;
})

//--------------------------------------------------------Funciones AMAZON------------------------------------------------------------------

/**Funcion para realizar la actualizacion del producto */
router.post('/actualiza_producto', async (req, res) => {    
    const productos = req.body;
    res.set('Access-Control-Allow-Origin', 'https://localhost:4200');
    const data = await amazon(productos.sku);
    if (data) {
      console.log(data.availability);
        productos.price = data.price;
        productos.availability = data.availability;
        res.json(productos);
    } else {
      res.status(404).json({ error: 'Producto no encontrado o prohibido' });
    }
        
})

/*Funcion de busqieda de productos amazon */
router.post('/actualiza_productos', async (req, res) => {    
    const productos = req.body;
    res.set('Access-Control-Allow-Origin', 'https://localhost:4200');
    for(let i=0; i < productos.length; i++) { 
        amazon(productos[i].seller_custom_field).then((data) => {
            if(data.price){
                productos[i].price = Number(data.price.replace('$',''));
                productos[i].available_quantity = data.disponibilidad
            }
            })
    }
    setTimeout(() => {
        res.json(productos);
    }, 25000);
    
})

// Create a new producto
router.post('/api/product', (req, res) => {
      let { product } = req.body;
      for(let i= 0; i < product.length; i++){
        db.query('INSERT INTO productos(ID_product,titulo, imagen, precio, disponibilidad, SKU, categoria) VALUES (?,?,?,?,?,?,?)', [product[i].ID_product,product[i].title, product[i].image, product[i].price,product[i].available_quantity,product[i].seller_custom_field,product[i].category_id ], 
        (err, result) => {
            if (err) {
                console.error('Error executing query: ' + err.stack);
                product[i].status = "Duplicado"
                // res.status(400).send('Error creating user');
            }
            product[i].status = "Publicado"
            //     res.status(201).send('User created successfully');
            });
        }
    res.json(product);
  });

// Create a new producto
router.get('/api/get_product', (req, res) => {
          db.query('SELECT * FROM productos', 
            (err, result) => {
              if (err) {
                    console.error('Error executing query: ' + err.stack);
                }
                res.json(result);

                });
  });

// multiplicadores
router.get('/api/get_precios', (req, res) => {
        db.query('SELECT * FROM precios', 
          (err, result) => {
            if (err) {
                  console.error('Error executing query: ' + err.stack);
              }
              res.json(result);

              });
});

router.get('/lista/:id/:scroll_id', async (req,res)=> {
    const {id, scroll_id} = req.params;
    findDataShop(id);
    setTimeout(async () => {
    let response = await fetch(`https://api.mercadolibre.com/users/${id}/items/search?search_type=scan&scroll_id=${scroll_id}&limit=100&status=active`,{method: "GET",headers: myHeaders});
    let data = await response.json()
    let resultados = data.results;
        let productos = [];
        for(let i=0; i < resultados.length; i++){
            const consulta = await fetch(`https://api.mercadolibre.com/items?ids=${resultados[i]}`,{method: "GET",headers: myHeaders});
            const producto = await consulta.json();
            let SKU = producto[0].body.seller_custom_field;
            if(!SKU || SKU == null || SKU == "")
              {
                const atributo = producto[0].body.attributes.find(obj =>  obj.id == 'SELLER_SKU');
                if(atributo){
                  SKU = atributo.value_name;
                }
              }
            let dias_entrega = 0;
              if(isNaN(producto[0].body.sale_terms[0].value_name.split(' días')[0]))
                dias_entrega = Number(producto[0].body.sale_terms[0].value_name.split(' días')[0])
              const item = {ID_product: producto[0].body.id, dias_entrega:dias_entrega, title: producto[0].body.title, price: producto[0].body.price, category_id: producto[0].body.category_id, available_quantity: producto[0].body.available_quantity, image: producto[0].body.thumbnail, seller_custom_field: SKU}
              if(SKU && SKU != null && SKU != "")
              productos.push(item);
        }
        let scroll = data.scroll_id;
        let resultado = { scroll_id: scroll, productos}
        res.json(resultado);
    },1000);
})

router.get('/lista/:id/:scroll_id', async (req,res)=> {
    const {id, scroll_id} = req.params;
    findDataShop(id);
    setTimeout(async () => {
    let response = await fetch(`https://api.mercadolibre.com/users/${id}/items/search?search_type=scan&scroll_id=${scroll_id}&limit=100&status=active`,{method: "GET",headers: myHeaders});
    let data = await response.json()
    let resultados = data.results;
        let productos = [];
        for(let i=0; i < resultados.length; i++){
            const consulta = await fetch(`https://api.mercadolibre.com/items?ids=${resultados[i]}`,{method: "GET",headers: myHeaders});
            const producto = await consulta.json();
            let SKU = producto[0].body.seller_custom_field;
           
            if(!SKU || SKU == null || SKU == "")
              {
                const atributo = producto[0].body.attributes.find(obj =>  obj.id == 'SELLER_SKU');
                if(atributo){
                  SKU = atributo.value_name;
                }
              }
            let dias_entrega = 0;
              if(isNaN(producto[0].body.sale_terms[0].value_name.split(' días')[0]))
                dias_entrega = Number(producto[0].body.sale_terms[0].value_name.split(' días')[0])
              const item = {ID_product: producto[0].body.id, dias_entrega:dias_entrega, title: producto[0].body.title, price: producto[0].body.price, category_id: producto[0].body.category_id, available_quantity: producto[0].body.available_quantity, image: producto[0].body.thumbnail, seller_custom_field: SKU}
              if(SKU && SKU != null && SKU != "")
              productos.push(item);
        }
        let scroll = data.scroll_id;
        let resultado = { scroll_id: scroll, productos}
        res.json(resultado);
    },1000);
})

router.get('/producto/:id', async (req,res)=> {
  const {id} = req.params;
  const dato = {"status":"paused"};
  let response = await fetch(`https://api.mercadolibre.com/items/${id}`,{method: "PUT",
      body: JSON.stringify(dato), 
      headers: myHeaders });
  let data = await response.json()
  let resultados = data.results;

  res.json(resultados);
})

// Obtener información de un producto por ASIN
router.get('/consulta/:ASIN', async (req, res) => {
  const { ASIN } = req.params;
  res.set('Access-Control-Allow-Origin', 'https://localhost:4200');
  
  try {
    const data = await amazon(ASIN);
    if (data) {
      res.json(data);
    } else {
      res.status(404).json({ error: 'Producto no encontrado o prohibido' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al consultar el producto' });
  }
});

router.post('/productos', async (req, res) => {
  const { link } = req.body;
  let totalAsins = [];
  console.log("link",link)
  try {
    const asins = await obtenerASINsYUltimaPagina(link, 1,totalAsins);
    res.json({ asins });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});
  
router.post('/palabrasProhibidas', async (req, res) => {
  const { palabras } = req.body;
  
  try {
    const prohibida = await palabrasProhibidas(palabras);
    res.json({ prohibida });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

// Predecir categoría según el título
router.get('/predictor/:titulo', async (req, res) => {
  const { titulo } = req.params;
  res.set('Access-Control-Allow-Origin', 'https://localhost:4200');
  
  try {
    const categoria = await predictorCategoria(titulo);
    res.json({ categoria });
  } catch (error) {
    res.status(500).json({ error: 'Error al predecir la categoría' });
  }
});


  // Obtener atributos de una categoría
router.get('/atributos/:categoria', async (req, res) => {
  const { categoria } = req.params;
  res.set('Access-Control-Allow-Origin', 'https://localhost:4200');
  try {
    const atributos = await obtenerAtributos(categoria);
    res.json({ atributos });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los atributos' });
  }
});
  
  // Publicar un producto
  router.post('/publicarProducto', async (req, res) => {
    const producto = req.body;
    res.set('Access-Control-Allow-Origin', 'https://localhost:4200');
    
    try {
      const resultado = await publicarProducto(producto);
      res.json(resultado);
    } catch (error) {
      res.status(500).json({ error: 'Error al publicar el producto' });
    }
  });

  router.get('/categoriaName/:categoriaID', async (req, res) => {
    const { categoriaID } = req.params;
    res.set('Access-Control-Allow-Origin', 'https://localhost:4200');
    
    try {
      const nombreCategoria = await getCategoryName(categoriaID);
      res.json(nombreCategoria);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el nombreCategoria' });
    }
  });
  
  // Función para consultar producto en Amazon
/*async function amazon(ASIN) {
  let images = [];
  const amazonUrl = `https://www.amazon.com/dp/${ASIN}?psc=1&language=en_US&ref_=nav_custrec_signin&zip_code=78040&th=1`;
  // console.log(`Consultando URL: ${amazonUrl}`);
  
  const product = {};
  const headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36",
      "Accept-Language": "en-US,en;q=0.9",
      "Accept-Encoding": "gzip, deflate, br",
      "Connection": "keep-alive",
      "Referer": "https://www.amazon.com/",
      "Upgrade-Insecure-Requests": "1",
      "DNT": "1", 
  };

  try {
    const response = await axios.get(amazonUrl,{ myHeaders });

    if (!response || !response.data) {
      throw new Error('No se pudo obtener el cuerpo de la respuesta.');
    }

    const body = response.data;
    const $ = cheerio.load(body);
    
    product.title = await traducirFrase($('h1#title').text().trim(), 'es');
    const brandText = $('#bylineInfo').text();
    product.vendor = brandText.replace('Brand: ', '').trim();
    product.description = await traducirFrase($('#feature-bullets').text().trim(), 'es');
    
    // Obtener la imagen principal desde 'data-old-hires'
    let mainImageUrl = $('#landingImage').attr('data-old-hires');
    if (mainImageUrl) {
        images.push({
            source: mainImageUrl  // Agregar la imagen principal al array
        });
    }

    $('#altImages img').each(function() {
      // Intenta obtener 'data-old-hires', si no existe usa 'src'
      let imageUrl = $(this).attr('data-old-hires') || $(this).attr('src');
      
      if (imageUrl && !imageUrl.includes('transparent-pixel')) {
          // Reemplazar el tamaño pequeño con un tamaño mayor en la URL
          imageUrl = imageUrl.replace(/_AC_US[0-9]+_/, '_SL1500_');
          images.push({
              source: imageUrl  // Agregar la imagen al array
          });
      }
    });

    product.image = images;

    product.sku = ASIN;
    const availability = $('#availability span.a-size-medium.a-color-success').text().trim();
    if(availability == 'In Stock'){
      product.availability = true;
    } else{
      product.availability = false;
    }
    
    const deliveryDate = $('span[data-csa-c-type="element"]').attr('data-csa-c-delivery-time');

    if (deliveryDate) {
      const currentYear = new Date().getFullYear(); // Obtiene el año actual
      const currentDate = new Date();
      const deliveryDateA = new Date(`${deliveryDate} ${currentYear}`);

      if (deliveryDate.includes("-")) {
          let [startDateString, endDateString] = deliveryDate.split(" - ");
          
          let startMonth = startDateString.split(" ")[0];
          let endDay = endDateString.trim();
          const endDate = new Date(`${startMonth} ${endDay}, ${currentYear}`);
          const diffEndDays = Math.ceil((endDate - currentDate) / (1000 * 60 * 60 * 24)); 
        
          if(diffEndDays <= 4){
            product.prime = true
          }else{
            product.prime = false
          }
      } else {
          const diffTime = deliveryDateA - currentDate; // Diferencia en milisegundos
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convertir a días
          if(diffDays <= 4){
            product.prime = true
          }else{
            product.prime = false
          }
      }
    } 
    else {
        // console.log("No se encontró la fecha de entrega en el atributo.");
    }

    const priceWhole = $('.a-price .a-price-whole').text();
    const priceFraction = $('.a-price .a-price-fraction').text();

    const priceText = `${priceWhole}.${priceFraction}`;
    product.price = Math.floor(parseFloat(priceText));

    palabrasProhibidas(`${product.title} ${product.description}`).then((value) => {
      // console.log("Producto:", product);
      // if(value == false)
      //   return product;
      // else
      //   return;

    } )
    return product;

  } catch (error) {
    console.error(`Error al obtener los datos del producto`);
    return { error: error.message };
  }
}*/
  async function amazon(ASIN) {
    let images = [];
    const amazonUrl = `https://www.amazon.com/dp/${ASIN}?psc=1&language=en_US&ref_=nav_custrec_signin&postalCode=78040`;
    const product = {};


    try {
      const response = (await axios.get(amazonUrl, { proxyConfig, myHeaders }));
    

      if (!response || !response.data) {
        throw new Error('No se pudo obtener el cuerpo de la respuesta.');
      }

      const body = response.data;
      const $ = cheerio.load(body);
      
      product.title = $('h1#title').text().trim();
      const brandText = $('#bylineInfo').text();
      product.vendor = brandText.replace('Brand: ', '').trim();
      let description = $('#feature-bullets').text().trim();
      product.description = description.slice(0, 400);
      // Obtener la imagen principal desde 'data-old-hires'
      let mainImageUrl = $('#landingImage').attr('data-old-hires');
      if (mainImageUrl) {
          images.push(mainImageUrl);
      }
      
    const totalImages = $('#altImages img').length;
    $('#altImages img').each(function(index) {
      // Intenta obtener 'data-old-hires', si no existe usa 'src'
      let imageUrl = $(this).attr('data-old-hires') || $(this).attr('src');
      
      if (imageUrl && !imageUrl.includes('transparent-pixel') && !imageUrl.includes('dp-play-icon-overlay')) {
          // Reemplazar el tamaño pequeño con un tamaño mayor en la URL
          imageUrl = imageUrl.replace(/_AC_US[0-9]+_/, '_SL1500_');
          if (index !== 0 && index !== totalImages - 1) {
            images.push(imageUrl);
        }
      }
    });

      product.image = images;
      product.image.pop();
      product.sku = ASIN;
      const availability = $('#availability span.a-size-medium.a-color-success').text().trim();
      console.log(availability)
      if(availability == 'Currently unavailable.'){
        product.availability = true;
      } else{
        product.availability = false;
      }

      const priceWhole = $('.a-price .a-price-whole').text();
      const priceFraction = $('.a-price .a-price-fraction').text();

      const priceText = `${priceWhole}.${priceFraction}`;
      product.price = Math.floor(parseFloat(priceText));

      return product;
    } catch (error) {
      console.error(`Error al obtener los datos del producto`);
      return { error: error.message };
    }
  }
  
  // Verifica si un ASIN pertenece a una marca prohibida
  async function palabrasProhibidas(campos) {
    const frase = campos.toLowerCase().split(/[\s,]+/);
    const lowerCaseStringList = stringList.map(palabra => palabra.toLowerCase());
   
    for (let i = 0; i < frase.length; i++) {
      const palabras = frase[i].toLowerCase().split(/[\s,]+/);
      for (let j = 0; j < palabras.length; j++) {
        if (lowerCaseStringList.includes(palabras[j])) {
          return true; 
        }
      }
    }
    return false; 
   }
  

    // Función para obtener ASINs y última página (mismo código que antes)
  /*async function obtenerASINsYUltimaPagina(url, paginaActual) {

    try {
      head = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
        "Connection": "keep-alive",
        "Referer": "https://www.amazon.com.mx/"
      }
      let data = await unirest.get(url).headers(head)
      const html = data.body;
      const $ = cheerio.load(data.body);
      let asins = [];
      
      $('[data-asin]').each((index, element) => {
        const asin = $(element).attr('data-asin');  // Capturar el ASIN del producto
        let prime = false;  // Inicializar prime como falso por defecto
        
        if (asin) {
            // Buscar dentro del elemento si existe el ícono de Amazon Prime
            const primeIcon = $(element).find('i[aria-label*="Prime"], span.aok-relative.s-prime');
            if (primeIcon.length > 0) {
                prime = true;  // El producto es Prime
            }
    
            // Agregar el ASIN y el estado de Prime a la lista
            asins.push({ asin, prime });
            totalAsins.push({ asin, prime });
          }
      });
  
      let numerosPaginas = [];
      $('span.s-pagination-strip').find('span.s-pagination-item').each((index, element) => {
          const numero = $(element).text().trim();
          if (!$(element).hasClass('s-pagination-button') && !isNaN(numero) && numero !== "") {
              numerosPaginas.push(numero);
          }
      });
  
      const totalPaginas = numerosPaginas.length > 0 ? parseInt(numerosPaginas[numerosPaginas.length - 1], 10) : null;
      if (maximaPagina<totalPaginas) {
        maximaPagina = totalPaginas;
      }
      console.log('Total Paginas: ' + totalPaginas + ' Arreglo con paginas ' + numerosPaginas);
      //console.log('Valores de pagina asins: ', asins)
      console.log(`Página ${paginaActual}:`, asins);
  
      if (paginaActual < maximaPagina) {
          const nuevaUrl = `${url.split('&page=')[0]}&page=${paginaActual + 1}`;
          return obtenerASINsYUltimaPagina(nuevaUrl, paginaActual + 1);
      } else {
          return totalAsins;
      }
    } catch (error) {
        console.error("Error en obtenerASINsYUltimaPagina:", error);
        throw error; // Lanzar error para manejar en el manejador POST
    }
  }*/

    async function obtenerASINsYUltimaPagina(url, paginaActual, totalAsins = []) {
      let maximaPagina = 0;
  
      try {
          const head = {
              "User-Agent": "Mozilla/5.0 (Windows NT 11.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
              "Accept-Language": "en-US,en;q=0.9",
              "Accept-Encoding": "gzip, deflate, br",
              "Connection": "keep-alive",
              "Referer": "https://www.amazon.com/&postalCode=78040"
          };
  
          // Realizar la solicitud a través del proxy
          let data = await unirest.get(url)
              .headers(head)
              .proxy(`http://${proxyConfig.auth.username}:${proxyConfig.auth.password}@${proxyConfig.host}:${proxyConfig.port}`);
  
          const html = data.body;
          console.log("html");
          const $ = cheerio.load(html);
          let asins = [];
  
          $('[data-asin]').each((index, element) => {
              const asin = $(element).attr('data-asin');
              let prime = false;
  
              if (asin) {
                  const primeIcon = $(element).find('i[aria-label*="Prime"], span.aok-relative.s-prime');
                  if (primeIcon.length > 0) {
                      prime = true;
                  }
                  asins.push({ asin, prime });
                  totalAsins.push({ asin, prime });
              }
          });
  
          let numerosPaginas = [];
          $('span.s-pagination-strip').find('span.s-pagination-item').each((index, element) => {
              const numero = $(element).text().trim();
              if (!$(element).hasClass('s-pagination-button') && !isNaN(numero) && numero !== "") {
                  numerosPaginas.push(numero);
              }
          });
  
          const totalPaginas = numerosPaginas.length > 0 ? parseInt(numerosPaginas[numerosPaginas.length - 1], 10) : null;
          if (maximaPagina < totalPaginas) {
              maximaPagina = totalPaginas;
          }
  
          console.log(`Página ${paginaActual}:`, asins);
  
          // Lógica de paginación
          if (paginaActual < maximaPagina) {
              const nuevaUrl = `${url.split('&page=')[0]}&page=${paginaActual + 1}`;
              return obtenerASINsYUltimaPagina(nuevaUrl, paginaActual + 1, totalAsins);
          } else {
              return totalAsins;
          }
      } catch (error) {
          console.error("Error en obtenerASINsYUltimaPagina:", error);
          throw error;
      }
  }

//---------------------------------------------------------FUNCION TRADUCIR -------------------------------------------------------------------
  const verificarTamanoImagen = async (url, index) => {
    try {
  
      const response = await axios.get(url, { responseType: 'arraybuffer' });
      const buffer = Buffer.from(response.data);
      const metadata = await sharp(buffer).metadata();
  
      if (metadata.width < 500 || metadata.height < 500) {
        console.log(`Imagen ${index + 1} no válida: dimensiones menores a 500x500 px`);
        return false;
      }
  
      if (!['jpeg', 'png', 'gif'].includes(metadata.format)) {
        console.log(`Imagen ${index + 1} no válida: formato no soportado (${metadata.format})`);
        return false;
      }
  
      console.log(`Imagen ${index + 1} válida: ${metadata.width}x${metadata.height} ${metadata.format}`);
      return true;
    } catch (error) {
      console.error(`Error al verificar la imagen ${index + 1}:`, error.message);
      return false;
    }
  };

//---------------------------------------------------------FUNCION TRADUCIR -------------------------------------------------------------------

/*apiKey = 'AIzaSyDAR9ZeT31Wk_mUG5K2GzfZV46UHBoER5k'; 
endpoint = 'https://translation.googleapis.com/language/translate/v2';

async function traducirFrase(texto, idiomaDestino) {
  try {
    const response = await axios.post(this.endpoint, null, {
      params: {
        q: texto,
        target: idiomaDestino,
        key: this.apiKey
      }
    });
    return response.data.data.translations[0].translatedText;

  } catch (error) {
    console.error('Error al traducir:', error);
    throw new Error('Error al traducir la frase.');
  }
}*/

module.exports = router;