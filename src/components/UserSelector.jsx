import { MultiSelect } from "react-multi-select-component";
import React, { useEffect, useState } from "react";
import axios from "../services/axios";

const UserSelector = ({ buildingId, onSelectedUsersChange }) => {
  const [availableUsers, setAvailableUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await axios.get(`/users/building/${buildingId}`);
      const users = response.data.map((user) => ({
        label: `${user.firstName} ${user.lastName}`,
        value: user.id,
      }));
      setAvailableUsers(users);
    };
    fetchUsers();
  }, [buildingId]);

  const handleChange = (selected) => {
    setSelectedUsers(selected);
    onSelectedUsersChange(selected.map((s) => s.value));
    console.log(
      "handleChange",
      selected.map((s) => s.value)
    );
  };

  return (
    <MultiSelect
      options={availableUsers}
      value={selectedUsers}
      onChange={handleChange}
      labelledBy="Выберите пользователей"
    />
  );
};

export default UserSelector;
