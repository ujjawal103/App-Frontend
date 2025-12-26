import React , {createContext, useContext , useState} from 'react'



export const StoreDataContext = createContext();

const StoreContext = ({children}) => {

    const [store, setStore] = useState({});
    const [ isLoading , setIsLoading] = useState(false);
    const [error, setError] = useState(null);


    const updateStore = (storeData) => {
        setStore(storeData);
    }

    const value = {
      store,
      setStore,
      updateStore,
      isLoading,
      setIsLoading,
      error,
      setError
    };

  return (
    <StoreDataContext.Provider value={value}>
      {children}
    </StoreDataContext.Provider>
  )
}

export default StoreContext
