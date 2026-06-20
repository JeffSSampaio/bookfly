import { bookService } from "@/services/bookService";
import { useServerTable } from "./useServerTable";

export function useBooks(){

 function getHeaders(){
   const headers = [
       {title: 'Id',key:'bookId'},
       {title:'Nome',key:'title'},
       {title: 'Autores',key:'authors'},
       { title: 'Ações', key: 'actions', sortable: false }
   ]
    return headers
    
 } 
async function getRows() {
    const response = await bookService.getAll()
    const list = Array.isArray(response) ? response : []

    return list.map((book: any) => {
      let authors = 'Sem autor'

      if (Array.isArray(book.authors)) {
      
        authors = typeof book.authors[0] === 'object'
          ? book.authors.map((a: any) => a.name).join(', ')
          : book.authors.join(', ')
      }

      return {
        ...book,
        authors: authors 
      }
    })
  }

    const tableEngine = useServerTable(getRows,getHeaders(),'Livros')



    
    return{
        ...tableEngine
    }
}