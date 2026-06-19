import { bookService } from "@/services/bookService";
import { useServerTable } from "./useServerTable";

export function useBooks(){
const headers = [
    {title: 'Id',key:'bookId'},
    {title:'Nome',key:'title'},
    {title: 'Autores',key:'authors'},
    { title: 'Ações', key: 'actions', sortable: false }
]
async function allbooks() {
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

    const tableEngine = useServerTable(allbooks,headers,'Livros')

    return{
        ...tableEngine
    }
}