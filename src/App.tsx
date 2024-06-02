import { useEffect, useState } from "react";
import axios from "axios";
import { Currency } from "./types";
import ReactPaginate from "react-paginate";

interface PageClickData {
  selected: number;
}

const App = () => {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [input, setInput] = useState<string>("");
  const [pageCount, setPageCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const perPage: number = 8;

  const fetchCurrencies = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("https://backend-expedicion-ml.vercel.app/currencies", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data: Currency[] = response.data;
      const offset: number = currentPage * perPage;
      const currentPageData: Currency[] = data.slice(offset, offset + perPage);
      setCurrencies(currentPageData);
      setPageCount(Math.ceil(data.length / perPage));
    } catch (error) {
      console.error("Error al obtener las monedas:", error);
    }
  };

  const handlePageClick = (data: PageClickData) => {
    const selectedPage: number = data.selected;
    setCurrentPage(selectedPage);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    localStorage.setItem("token", input);
    try {
      await fetchCurrencies();
    } catch (error) {
      console.error("Error al obtener datos:", error);
    }
  };

  useEffect(() => {
    fetchCurrencies();
  }, [currentPage]);

  return (
    <div className="w-full p-5">
      <form onSubmit={handleSubmit} className="flex flex-col w-1/3 mb-5">
        <label className="mb-2">
          Contraseña:
          <input
            type="password"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="border rounded p-1 ml-2"
          />
        </label>
        <button type="submit" className="bg-blue-400 p-1 rounded">
          Enviar
        </button>
      </form>

      {currencies.length > 0 && (
        <>
          <h1 className="mb-3">Currencies</h1>
          <table className="w-full mb-3">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="py-2">ID</th>
                <th className="py-2">Descripción</th>
              </tr>
            </thead>
            <tbody>
              {currencies.map((currency: Currency) => (
                <tr key={currency.id} className="border-b">
                  <td className="py-2">{currency.id}</td>
                  <td className="py-2">{currency.description}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <ReactPaginate
            previousLabel={"Anterior"}
            nextLabel={"Siguiente"}
            pageCount={pageCount}
            onPageChange={handlePageClick}
            containerClassName={"flex justify-center items-center my-4"}
            previousLinkClassName={"bg-gray-200 p-2 mr-2 rounded"}
            nextLinkClassName={"bg-gray-200 p-2 ml-2 rounded"}
            pageClassName={"mr-2"} // Agregar margen entre los números de página
            activeClassName={"pagination__link--active"}
          />
        </>
      )}
    </div>
  );
};

export default App;
