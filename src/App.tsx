import { useEffect, useState } from "react";
import axios from "axios";
import { Order } from "./types"; // Suponiendo que tienes un tipo `Order`
import ReactPaginate from "react-paginate";

interface PageClickData {
  selected: number;
}

const App = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [input, setInput] = useState<string>("");
  const [pageCount, setPageCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const perPage: number = 8;

  const fetchMyOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "https://backend-expedicion-ml.vercel.app/my-orders",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Extraer los resultados de la respuesta y el conteo total de páginas
      const { results, paging } = response.data;
      const totalResults = paging.total;

      // Actualizar el estado de las órdenes y el conteo de páginas
      setOrders(results);
      setPageCount(Math.ceil(totalResults / perPage));
    } catch (error) {
      console.error("Error al obtener las órdenes:", error);
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
      await fetchMyOrders();
    } catch (error) {
      console.error("Error al obtener datos:", error);
    }
  };

  useEffect(() => {
    fetchMyOrders();
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

      {orders.length > 0 && (
        <>
          <h1 className="mb-3">Compras</h1>
          <table className="w-full mb-3">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="py-2">Número de Pedido</th>
                <th className="py-2">Nombre del Vendedor</th>
                <th className="py-2">Artículos</th>
                <th className="py-2">Cantidad</th>
              </tr>
            </thead>
            <tbody>
              {orders
                .slice(currentPage * perPage, (currentPage + 1) * perPage)
                .map((order: Order) =>
                  // Iterar sobre los artículos de la orden
                  order.order_items.map((item, itemIndex) => (
                    <tr
                      key={`${order.id}-${item.item.id}`}
                      className="border-b"
                    >
                      {/* Renderizar el número de pedido solo en el primer elemento de la orden */}
                      {itemIndex === 0 && (
                        <td className="py-2" rowSpan={order.order_items.length}>
                          {order.id}
                        </td>
                      )}
                      {/* Renderizar el nombre del vendedor solo en el primer elemento de la orden */}
                      {itemIndex === 0 && (
                        <td className="py-2" rowSpan={order.order_items.length}>
                          {order.seller.nickname}{" "}
                          {/* Aquí debes acceder al nombre del vendedor */}
                        </td>
                      )}
                      <td className="py-2">{item.item.title}</td>
                      <td className="py-2">{item.quantity}</td>
                    </tr>
                  ))
                )}
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
