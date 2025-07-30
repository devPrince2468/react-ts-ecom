import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { User } from "../../types/User";

import { getAllUsers } from "../../redux/Slices/users/userThunks";
import { AppDispatch, RootState } from "../../redux/store";

const Users = () => {
  const dispatch: AppDispatch = useDispatch();
  const { users, loading } = useSelector((state: RootState) => state.users);

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  return (
    <div>
      <h1>Admin - Manage Users</h1>
      {loading && <p>Loading users...</p>}
      {users && (
        <ul>
          {users.map((u: User) => (
            <li key={u.id}>{u.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
};
export default Users;
