interface Props {
  selected: string;
  onSelect: (value: string) => void;
}

export default function BookmarkFilter({ selected, onSelect }: Props) {
  const filters = ["All", "Job", "Event", "Resource"];

  return (
    <div className="flex space-x-2 mb-4">
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => onSelect(filter)}
          className={`px-4 py-1 rounded-full text-sm font-medium border ${
            selected === filter
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-gray-700 border-gray-300"
          } transition`}
        >
          {filter}
        </button>
      ))}
    </div>
  );
}
