const http = require("http");
const fs = require("fs");
const path = require("path");
const { extname } = require("path");

const server = http.createServer((req, res) => {
  //   res.write("THIS IS A SERVER");
  //   res.end();

  //Build filepath
  let filePath = path.join(
    __dirname,
    "public",
    req.url === "/" ? "index.html" : req.url
  );

  let contentType = "application/json";

  switch (path.extname(filePath)) {
    case ".html":
      contentType = "text/html";
      break;
  }

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if ((err.code = "ENOENT")) {
        //Page not found
        fs.readFile(
          path.join(__dirname, "public", "404.html"),
          (err, content) => {
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(content, "utf-8");
          }
        );
      } else {
        // Some server error
        res.writeHead(500);
        res.end(`SERVER ERROR: ${err.code}`);
      }
    } else {
      // Success
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(content, "utf-8");
    }
  });

  if (req.url === "/") {
    fs.readFile(
      path.join(__dirname, "public", "index.html"),
      (err, content) => {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(content);
      }
    );
  }

  if (req.url === "/api/characters") {
    const characters = {
      1: {
        name: "Fin the Human",
        otherNames: ["Fin Mertans"],
        age: 12,
      },
    };
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(characters));
  }
});

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => console.log(`Server running on PORT: ${PORT}`));
