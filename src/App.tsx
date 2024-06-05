import React, { useEffect, useState } from "react";
import axios from "axios";
import { Order } from "./types";
import ReactPaginate from "react-paginate";
import { format } from "date-fns";

interface PageClickData {
  selected: number;
}

const App = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [input, setInput] = useState<string>("");
  const [pageCount, setPageCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const perPage: number = 10;

  const fetchMyOrders = async () => {
    try {
      let ordersFromStorage: Order[] = []; // Se proporciona un valor predeterminado
      const storedOrders = localStorage.getItem("orders");
      if (storedOrders) {
        ordersFromStorage = JSON.parse(storedOrders);
      }
      setOrders(ordersFromStorage);
      setPageCount(Math.ceil(ordersFromStorage.length / perPage));

      if (!storedOrders) {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "https://backend-expedicion-ml.vercel.app/my-ordereds",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Filtrar las órdenes para excluir las canceladas
        const filteredOrders = response.data.results.filter(
          (order: Order) => order.status !== "cancelled"
        );

        // Guardar las órdenes en el almacenamiento local
        localStorage.setItem("orders", JSON.stringify(filteredOrders));

        // Actualizar el estado de las órdenes y el conteo de páginas
        setOrders(filteredOrders);
        setPageCount(Math.ceil(filteredOrders.length / perPage));
      }
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

  const handleRefresh = () => {
    localStorage.setItem("orders", "");
    fetchMyOrders();
  };

  const handleCerrarSesion = () => {
    localStorage.setItem("token", "");
    localStorage.setItem("orders", "");
    window.location.reload();
  };

  useEffect(() => {
    fetchMyOrders();
  }, []);

  return (
    <div className="h-screen flex flex-col bg-slate-100">
      {orders.length === 0 && (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center m-auto"
        >
          <label className="flex flex-col mb-2 uppercase">
            Contraseña:
            <input
              type="password"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="border rounded p-1 mt-2"
            />
          </label>
          <button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 px-4 py-2 w-2/3 rounded uppercase"
          >
            Enviar
          </button>
        </form>
      )}

      {orders.length > 0 && (
        <div className="w-full flex flex-col mt-5">
          <section className="flex flex-row w-11/12 mx-auto justify-between my-2">
            <img
              src="https://mercadoindustria.com.ar/wp-content/uploads/2021/05/logoconoflexnaranja.png"
              alt="logo conoflex"
              className="w-72 mb-5"
            />
            <section>
              <button
                type="submit"
                onClick={handleRefresh}
                className="bg-blue-400 hover:bg-blue-500 rounded p-2 w-fit h-fit align-middle uppercase font-bold text-sm mr-5"
              >
                Actualizar
              </button>
              <button
                type="submit"
                onClick={handleCerrarSesion}
                className="bg-red-400 hover:bg-red-500 rounded p-2 w-fit h-fit align-middle uppercase font-bold text-sm"
              >
                Cerrar sesión
              </button>
            </section>
          </section>
          <section className="flex flex-col">
            <table className=" w-11/12 mx-auto mb-5 bg-slate-200 text-sm text-justify">
              <caption className="caption-top mb-2">
                Pedidos por página: {perPage}
              </caption>
              <thead>
                <tr className="bg-gray-300 text-gray-700">
                  <th className="p-2">N° de Pedido</th>
                  <th className="p-2">Fecha y hora</th>
                  <th className="p-2">Comprador</th>
                  <th className="p-2">Artículos</th>
                  <th className="p-2">Código</th>
                  <th className="p-2">Color</th>
                  <th className="p-2">Cantidad</th>
                  {/* <th className="p-2">Entregado</th> Nueva columna */}
                </tr>
              </thead>
              <tbody>
                {orders
                  .slice(currentPage * perPage, (currentPage + 1) * perPage)
                  .map((order) => {
                    return order.order_items.map((item, itemIndex) => (
                      <tr key={order.id}>
                        {/* Renderizar el número de pedido solo en el primer elemento de la orden */}
                        {itemIndex === 0 && <td className="p-2">{order.id}</td>}
                        {/* Agregar columna para fecha y hora */}
                        {itemIndex === 0 && (
                          <td className="p-2">
                            {format(
                              new Date(order.date_created),
                              "dd/MM/yy HH:mm"
                            )}
                          </td>
                        )}
                        {/* Renderizar el nombre del vendedor solo en el primer elemento de la orden */}
                        {itemIndex === 0 && (
                          <td className="p-2">{order.buyer.nickname}</td>
                        )}

                        <td className="p-2">{item.item.title}</td>
                        <td className="p-2">
                          {order.order_items[0].item.seller_sku}
                        </td>
                        {/* Verificar si variation_attributes está presente antes de acceder a su primer elemento */}
                        <td className="p-2">
                          {item.item.variation_attributes &&
                          item.item.variation_attributes.length > 0
                            ? item.item.variation_attributes[0].value_name
                            : "N/A"}
                        </td>
                        <td className="p-2">{item.quantity}</td>
                        {/* <td className="p-2">{"Entregado / No entregado"}</td> */}
                      </tr>
                    ));
                  })}
              </tbody>
            </table>
            <ReactPaginate
              previousLabel={"Anterior"}
              nextLabel={"Siguiente"}
              pageCount={pageCount}
              onPageChange={handlePageClick}
              containerClassName={"flex justify-center items-center my-4"}
              previousLinkClassName={
                "bg-orange-500 hover:bg-orange-600 text-white p-2 mr-2 rounded"
              }
              nextLinkClassName={
                "bg-orange-500 hover:bg-orange-600 text-white p-2 ml-2 rounded"
              }
              pageClassName={"mr-2"}
              activeClassName={"pagination__link--active"}
            />
          </section>

          <div className="w-11/12 mx-auto"></div>
        </div>
      )}
    </div>
  );
};

export default App;
