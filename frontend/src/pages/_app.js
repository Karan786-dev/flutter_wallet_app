import store from "@/store"
import { Provider } from "react-redux"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css";
import "@/styles/global.css"

function MyApp({ Component, pageProps }) {
    return (
        <Provider store={store}>
            <ToastContainer
                position="top-right"
                autoClose={2000}
                hideProgressBar
                newestOnTop
                closeOnClick
                draggable
                theme="light"
            />
            <Component {...pageProps} />
        </Provider>
    )
}

export default MyApp