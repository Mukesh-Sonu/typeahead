import AutoComplete from "./components/AutoComplete";
import "./App.css";

function App() {
  const staticData = ["apple", "orange", "mango", "banana", "avacado", "kiwi"];
  const fetchSuggesstions = async (query) => {
    const response = await fetch(
      `https://dummyjson.com/recipes/search?q=${query}`
    );
    if (!response.ok) {
      throw new Error("Network resposne is not ok!");
    }
    const result = await response.json();
    return result.recipes;
  };

  return (
    <AutoComplete
      placeholder="Enter recipe..."
      fetchSuggesstions={fetchSuggesstions}
      // staticData={staticData}
      onChange={(value) => console.log(value)}
      onSelect={(value) => console.log(value)}
      caching
      dataKey={"name"}
      onFocus={() => {}}
      onBlur={() => {}}
      customLoading={<>Loading...</>}
      customStyles={{}}
    />
  );
}

export default App;
