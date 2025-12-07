export const updateQuery = (searchParams, setSearchParams, updates) => {
  const newParams = new URLSearchParams(searchParams);

  Object.entries(updates).forEach(([key, value]) => {
    if (value === "" || value === null || value === undefined) {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
  });

  setSearchParams(newParams);
};
