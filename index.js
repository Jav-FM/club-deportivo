const http = require("http");
const url = require("url");
const fs = require("fs");

const server = http
  .createServer((req, res) => {
    if (req.url === "/") {
      res.writeHead(200, { "Content-Type": "text/html" });
      fs.readFile("index.html", "utf8", (err, data) => {
        res.end(data);
      });
    }

    // 1. Crear una ruta que reciba el nombre y precio de un nuevo deporte, lo persista en un archivo JSON.
    if (req.url.includes("/agregar")) {
      const { nombre, precio } = url.parse(req.url, true).query;
      const deporte = {
        nombre,
        precio,
      };
      let data = JSON.parse(fs.readFileSync("Deportes.json", "utf8"));
      data.deportes.push(deporte);
      fs.writeFile("Deportes.json", JSON.stringify(data), (err) => {
        if (err) return res.end("Falló registro de deporte");
        res.end("Deporte Registrado");
      });
    }

    // 2. Crear una ruta que al consultarse devuelva en formato JSON todos los deportes registrados.
    if (req.url === "/deportes") {
      fs.readFile("Deportes.json", "utf-8", (err, data) => {
        if (err) res.end("Error al consultar JSON");
        res.end(data);
      });
    }

    // 3. Crear una ruta que edite el precio de un deporte registrado utilizando los parámetros de la consulta y persista este cambio.
    if (req.url.includes("/editar")) {
      const { nombre, precio } = url.parse(req.url, true).query;
      const data = JSON.parse(fs.readFileSync("Deportes.json", "utf8"));
      const newDeportes = data.deportes.map((d) => {
        if (d.nombre === nombre) {
          d.precio = precio;
          return d;
        }
        return d;
      });
      const newData = {
        deportes: newDeportes,
      };
      fs.writeFile("Deportes.json", JSON.stringify(newData), (err) => {
        if (err) return res.end("Falló registro de deporte");
        res.end("Deporte editado");
      });
    }

    // 4. Crear una ruta que elimine un deporte solicitado desde el cliente y persista este cambio.
    if (req.url.includes("/eliminar")) {
      const { nombre } = url.parse(req.url, true).query;
      const data = JSON.parse(fs.readFileSync("Deportes.json", "utf8"));
      const newDeportes = data.deportes.filter((d) => d.nombre !== nombre);
      let newData = {
        deportes: newDeportes,
      };
      fs.writeFile("Deportes.json", JSON.stringify(newData), (err) => {
        if (err) return res.end("Falló eliminación de deporte.");
        res.end(`Deporte ${nombre} eliminado`);
      });
    }
  })
  .listen(3000, () => {
    console.log("Server ON");
  });
