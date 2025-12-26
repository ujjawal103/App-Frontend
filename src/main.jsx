import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter  } from 'react-router-dom'
import AdminContext from './context/AdminContext.jsx'
import 'remixicon/fonts/remixicon.css'
import SocketProvider from './context/SocketContext.jsx' 
import StoreContext from './context/StoreContext.jsx'
import BackButtonHandler from './BackButtonHandler.jsx'


createRoot(document.getElementById('root')).render(
            <SocketProvider> 
              <StoreContext>
                <AdminContext>
                  <BrowserRouter>
                    <BackButtonHandler />
                      <App />
                  </BrowserRouter>
                </AdminContext>
              </StoreContext>
           </SocketProvider>
);
