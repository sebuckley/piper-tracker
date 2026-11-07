import SearchListItem from "./SearchListItem";

export default function SearchList({
  items,
  search,
  onSearch,
  labelKey,
  sourceKey,
  onAdd
}) {
  const handleAdd = item => {
    onAdd(item);      // Add the item to the parent
    onSearch("");     // ⭐ Clear search immediately
  };

  return (
    <>
      {/* Search Input */}
      <input
        className="form-control mb-2"
        placeholder="Search..."
        value={search}
        onChange={e => onSearch(e.target.value)}
        style={{ borderRadius: "12px" }}
      />

      {/* Only show results when typing */}
      {search.trim() !== "" &&
        items
          .filter(item =>
            ((item[labelKey] || "") + "")
              .toLowerCase()
              .includes(search.toLowerCase())
          )
          .map(item => (
            <SearchListItem
              key={item.id}
              label={item[labelKey]}
              source={item[sourceKey]}
              onAdd={() => handleAdd(item)}   // ⭐ Use wrapper
            />
          ))}
    </>
  );
}
