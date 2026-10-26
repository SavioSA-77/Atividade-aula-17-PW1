const express = require("express");

const app = express();
const port = process.env.PORT || 3000;
const quotesApiUrl = "https://ron-swanson-quotes.herokuapp.com/v2/quotes";

app.set("view engine", "ejs");
app.set("views", `${__dirname}/views`);
app.use(express.static(`${__dirname}/public`));

app.get("/", async (_request, response) => {
  try {
    const apiResponse = await fetch(quotesApiUrl, {
      signal: AbortSignal.timeout(5000),
    });

    if (!apiResponse.ok) {
      throw new Error(`A API respondeu com o status ${apiResponse.status}.`);
    }

    const quotes = await apiResponse.json();
    const quote = Array.isArray(quotes) ? quotes[0] : null;

    if (typeof quote !== "string" || quote.trim() === "") {
      throw new Error("A API não retornou uma mensagem válida.");
    }

    response.render("index", { quote, error: null });
  } catch (error) {
    console.error("Não foi possível carregar a mensagem do dia:", error);
    response.status(502).render("index", {
      quote: null,
      error: "Não foi possível carregar a mensagem agora. Tente novamente.",
    });
  }
});

app.listen(port, () => {
  console.log(`Mensagem do Dia disponível em http://localhost:${port}`);
});
