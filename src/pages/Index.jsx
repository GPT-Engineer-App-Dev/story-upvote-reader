import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  const [stories, setStories] = useState([]);
  const [filteredStories, setFilteredStories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchTopStories = async () => {
      try {
        const { data: topStoryIds } = await axios.get('https://hacker-news.firebaseio.com/v0/topstories.json');
        const top20StoryIds = topStoryIds.slice(0, 20);
        const storyPromises = top20StoryIds.map(id => axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`));
        const stories = await Promise.all(storyPromises);
        setStories(stories.map(story => story.data));
        setFilteredStories(stories.map(story => story.data));
      } catch (error) {
        console.error('Error fetching top stories:', error);
      }
    };

    fetchTopStories();
  }, []);

  useEffect(() => {
    setFilteredStories(
      stories.filter(story =>
        story.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, stories]);

  return (
    <div className="p-4">
      <h1 className="text-3xl text-center mb-4">Top 20 Hacker News Stories</h1>
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Search stories..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-1 gap-4">
        {filteredStories.map(story => (
          <Card key={story.id}>
            <CardHeader>
              <CardTitle>{story.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Upvotes: {story.score}</p>
              <a href={story.url} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                Read more
              </a>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Index;