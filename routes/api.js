/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const Book = require('../models.js').Book; // Importa el modelo Book

module.exports = function (app) {

  app.route('/api/books')
  .get(async (req, res) => {
    try {
      // Busca todos los libros en la base de datos
      const books = await Book.find({});
  
      // Si no se encuentran libros, devuelve un error 404
      if (!books || books.length === 0) {
        return res.status(404).json({ error: 'no book exists' });
      }
  
      // Formatea cada libro para incluir el conteo de comentarios
      const formatData = books.map(book => ({
        _id: book._id,
        title: book.title,
        comments: book.comments,
        commentcount: book.comments.length // Cantidad de comentarios
      }));
  
      // Devuelve los libros formateados como JSON
      res.json(formatData);
      
    } catch (error) {
      // Maneja errores inesperados al consultar los libros
      console.error('Error fetching books:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  })
  

    .post(async (req, res) => {
      const title = req.body.title;
    
      // Verifica si se proporcionó el título
      if (!title || title.trim() === '') {
        return res.send('missing required field title');
      }
    
      // Crea una nueva instancia del libro
      const newBook = new Book({ title, comments: [] });
    
      try {
        // Guarda el libro en la base de datos
        const book = await newBook.save();
    
        // Devuelve el _id y título del libro recién creado
        res.json({ _id: book._id, title: book.title });
      } catch (error) {
        // Maneja errores inesperados al guardar
        res.status(500).json({ error: 'Error saving book' });
      }
    })
    
    .delete(async (req, res) => {
      // Elimina todos los libros de la base de datos y devuelve un mensaje de éxito.
      try {
        // Elimina todos los libros de la base de datos
        await Book.deleteMany({});
        res.send('complete delete successful');
      } catch (error) {
        // Maneja errores inesperados al eliminar
        res.status(500).send('internal server error');
      }
    });



  app.route('/api/books/:id')
    .get(async (req, res) =>{
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      try {
        // Busca el libro por su ID y devuelve el libro con su título y comentarios.
        const book = await Book.findById(bookid);

        // Si no se encuentra el libro, devuelve un error 404 y un mensaje de error.
        if (!book) {
          return res.send('no book exists');
        }
        // Devuelve el libro encontrado y su título y comentarios.
        res.json({ _id: book._id, title: book.title, comments: book.comments, commentcount: book.comments.length });
      } catch (error) {
        // Maneja errores inesperados al buscar el libro
        console.error('Error fetching book:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    })
    
    .post(async (req, res) => {
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
      // Verifica si se proporcionó el comentario
      if (!comment || comment.trim() === '') {
        return res.send('missing required field comment');
      }
      try {
        // Busca el libro por su ID
        const book = await Book.findById(bookid);
        if (!book) {
          return res.send('no book exists');
        }
  
        // Agrega el comentario al libro
        book.comments.push(comment);
  
        // Guarda el libro actualizado en la base de datos
        await book.save();
  
        // Devuelve el libro actualizado
        res.json({
          _id: book._id,
          title: book.title,
          comments: book.comments,
          commentcount: book.comments.length // Cantidad de comentarios
        });
      } catch (error) {
        // Maneja errores inesperados al guardar el comentario
        res.status(500).json({ error: 'Error saving comment' });
      }
    })

    .delete(async (req, res) => {
      const bookid = req.params.id;
      // json res format same as .get
      // Verifica si se proporcionó el ID del libro
      try {
        const deleted = await Book.findByIdAndDelete(bookid);
        // Si no se encuentra el libro, devuelve un error 404 y un mensaje de error.
        if (!deleted) {
          return res.send('no book exists');
        }
        // Si se encuentra y elimina el libro, devuelve un mensaje de éxito.
        res.send('delete successful');
      } catch (error) {
        res.status(500).send('internal server error');
      }
    });
};
