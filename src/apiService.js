import axios from 'axios';

const BASE_URL = 'https://openlibrary.org';

export const fetchBooks = async (page = 1, limit = 10) => {
  try {
    const response = await axios.get(`${BASE_URL}/subjects/science.json?limit=${limit}&offset=${(page - 1) * limit}`);
    const books = response.data.works;
    const formattedBooks = await Promise.all(books.map(async (book) => {
      const authorData = await axios.get(`${BASE_URL}${book.authors[0].key}.json`);
      return {
        title: book.title,
        author_name: authorData.data.name,
        first_publish_year: book.first_publish_year,
        subject: book.subject,
        author_birth_date: authorData.data.birth_date,
        author_top_work: authorData.data.top_work,
        ratings_average: book.ratings_average || 'N/A'
      };
    }));
    return formattedBooks;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};
