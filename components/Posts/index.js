import axios from 'axios';
import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import Post from './Post';
import Container from '../common/Container';
import { useWindowWidth } from '../context/WindowWidthContext';

const PostListContainer = styled.div(() => ({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
}));

const LoadMoreButton = styled.button(() => ({
  padding: '10px 20px',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: 5,
  cursor: 'pointer',
  fontSize: 16,
  marginTop: 20,
  transition: 'background-color 0.3s ease',
  fontWeight: 600,

  '&:hover': {
    backgroundColor: '#0056b3',
  },
  '&:disabled': {
    backgroundColor: '#808080',
    cursor: 'default',
  },
}));

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [start, setStart] = useState(0);
  const [limit, setLimit] = useState(10);
  const [allPostsFetched, setAllPostsFetched] = useState(false); // Track if all posts have been fetched

  const { isSmallerDevice } = useWindowWidth();

  useEffect(() => {
    fetchPosts();
  }, [isSmallerDevice]);

  const fetchPosts = async () => {
    try {
      const { data: newPosts } = await axios.get('/api/v1/posts', {
        params: { start, limit: isSmallerDevice ? 5 : 10 },
      });

      if (newPosts.length === 0 || posts.length >= 50) {
        setAllPostsFetched(true);
      } else {
        setPosts(prevPosts => [...prevPosts, ...newPosts.slice(0, 50 - prevPosts.length)]);
        setStart(prevStart => prevStart + limit);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleClick = async () => {
    setIsLoading(true);

    await fetchPosts();

    setIsLoading(false);
  };

  return (
    <Container>
      <PostListContainer>
        {posts.map(post => (
          <Post key={post.id} post={post} />
        ))}
      </PostListContainer>

      {posts.length > 0 && !allPostsFetched && (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <LoadMoreButton onClick={handleClick} disabled={isLoading}>
            {!isLoading ? 'Load More' : 'Loading...'}
          </LoadMoreButton>
        </div>
      )}
    </Container>
  );
}
