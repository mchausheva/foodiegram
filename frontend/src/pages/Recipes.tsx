// src/pages/Recipes.tsx
import { Container, Row, Col, Form, Button, Dropdown } from 'react-bootstrap';
import RecipeCard from '../components/RecipeCard';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setRecipes } from '../features/recipeSlice';
import api from '../services/api';
import { RootState } from '../features/store';
import Validator from './Validator';
import { Difficulty } from '../types/recipe.types';

function Recipes() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const recipes = useSelector((state: RootState) => state.recipes.recipes);
  const [categories, setCategories] = useState<string[]>([]);

  // Local UI state for filters
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<'new' | 'rating' | 'old'>('new');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchRecipes = async (signal?: AbortSignal) => {
    const { data } = await api.get('/recipes', {
      signal,
      params: {
        q: searchTerm || undefined,
        category: selectedCategories.length ? selectedCategories.join(',') : undefined,
        difficulty: selectedDifficulties.length ? selectedDifficulties.join(',') : undefined,
        sort: sortOption,
        page,
        limit: 8
      }
    });
    dispatch(setRecipes(data.recipes || data));
    if (data.totalPages) setTotalPages(data.totalPages);
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchRecipes(controller.signal);
    // Load categories from backend for filters
    (async () => {
      try {
        const { data } = await api.get('/recipes/categories');
        setCategories(data);
      } catch {}
    })();
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, selectedCategories, selectedDifficulties, sortOption, page]);

  const toggleCategory = (value: string) => {
    setSelectedCategories((prev) =>
      prev.includes(value) ? prev.filter((c) => c !== value) : [...prev, value]
    );
  };
  const toggleDifficulty = (value: string) => {
    setSelectedDifficulties((prev) =>
      prev.includes(value) ? prev.filter((d) => d !== value) : [...prev, value]
    );
  };
  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategories([]);
    setSelectedDifficulties([]);
    setSortOption('new');
  };

  return (
    <Container>
      <h2 className="text-center my-4">🍽️ Recipes</h2>
      {!user ? (
        <Validator />
      ) : (
        <>
          <Form className="mb-4">
            <Row className="g-3 align-items-center">
              <Col xs={12} md={4}>
                <Form.Control
                  type="text"
                  placeholder="Search recipes by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </Col>

              <Col xs={12} md={2}>
                <Form.Select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value as any)}
                >
                  <option value="new">Newest</option>
                  <option value="old">Oldest</option>
                  <option value="rating">Highest Rated</option>
                </Form.Select>
              </Col>

              {/* Categories Dropdown */}
              <Col xs={12} md={2} className="position-relative">
                <Dropdown>
                  <Dropdown.Toggle variant="outline-secondary" id="cat-dd-toggle">
                    Categories
                  </Dropdown.Toggle>

                  <Dropdown.Menu onClick={(e)=>e.stopPropagation()} style={{maxHeight:'300px',overflowY:'auto'}}>
                    {categories.map((cat)=>(
                      <Dropdown.Item key={cat} as="div" className="px-3 py-1">
                        <Form.Check
                          type="checkbox"
                          id={`cat-${cat}`}
                          label={cat}
                          value={cat}
                          checked={selectedCategories.includes(cat)}
                          onChange={()=>toggleCategory(cat)}
                        />
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </Col>

              {/* Difficulty Dropdown */}
              <Col xs={12} md={1} className="position-relative">
                <Dropdown>
                  <Dropdown.Toggle variant="outline-secondary" id="diff-dd-toggle">
                    Difficulty
                  </Dropdown.Toggle>

                  <Dropdown.Menu onClick={(e)=>e.stopPropagation()} style={{maxHeight:'300px',overflowY:'auto'}}>
                    {Object.values(Difficulty).map((diff)=>(
                      <Dropdown.Item key={diff} as="div" className="px-3 py-1">
                        <Form.Check
                          type="checkbox"
                            id={`diff-${diff}`}
                          label={diff}
                          value={diff}
                          checked={selectedDifficulties.includes(diff)}
                          onChange={()=>toggleDifficulty(diff)}
                        />
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </Col>

              <Col xs={12} md="auto">
                <Button variant="secondary" onClick={handleClearFilters}>
                  Clear
                </Button>
              </Col>
            </Row>
          </Form>

          <Row>
            {recipes.map((recipe) => (
              <Col key={recipe.id} sm={12} md={6} lg={4} xl={3} className="mb-4">
                <RecipeCard recipe={recipe} />
              </Col>
            ))}
          </Row>

          {totalPages > 1 && (
            <div className="d-flex justify-content-center align-items-center gap-3 my-4">
              <Button
                variant="outline-secondary"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Prev
              </Button>
              <span>Page {page} of {totalPages}</span>
              <Button
                variant="outline-secondary"
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </Container>
  );
}

export default Recipes;
