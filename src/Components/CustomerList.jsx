const CustomerList = ({ customers, onEdit, onDelete }) => {
  return (
    <div className="w-64 p-4 bg-white shadow-lg rounded-lg">
      <h3 className="text-xl font-semibold mb-4">Customers</h3>
      <div className="overflow-auto max-h-96">
        {customers.map((customer) => (
          <div key={customer.id} className="mb-4 p-4 border-b border-gray-300">
            <h4 className="text-lg font-bold">{customer.name}</h4>
            <p className="text-sm text-gray-600">{customer.address}</p>
            <p className="text-sm text-gray-600">Distance: {customer.distance} km</p>
            <div className="flex justify-end space-x-2 mt-2">
              <button
                onClick={() => onEdit(customer)}
                className="text-blue-500 hover:text-blue-700">
                Edit
              </button>
              <button
                onClick={() => onDelete(customer.id)}
                className="text-red-500 hover:text-red-700">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerList;
