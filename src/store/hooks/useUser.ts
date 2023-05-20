import React, { useState } from "react";
import { useSession } from "next-auth/react";

export default function useUser() {
  const [state, setState] = useState();
  const { data } = useSession();

  return {};
}
