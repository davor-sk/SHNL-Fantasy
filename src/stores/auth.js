import { defineStore } from "pinia";
import { ref } from "vue";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";

export const useAuthStore = defineStore("auth", () => {
  const user = ref(null);
  const role = ref("");
  const loading = ref(true);

  onAuthStateChanged(auth, async (currentUser) => {
    user.value = currentUser;
    loading.value = false;

    if (currentUser) {
      const userDocSnap = await getDoc(doc(db, "users", currentUser.uid));
      if (userDocSnap.exists()) {
        role.value = userDocSnap.data().role;
      } else {
        role.value = "";
      }
    }
  });

  async function logout() {
    await signOut(auth);
    user.value = null;
  }

  return { user, logout, role };
});
