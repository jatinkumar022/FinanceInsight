import { useEffect, useState } from "react";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { auth } from "@/db/firebase";
import { Link, useLocation } from "react-router-dom";
import ReactLoading from "react-loading"; // Import ReactLoading
interface NavbarProps {
  username?: string | null; // Allow username to be string or null
}
const Navbar: React.FC<NavbarProps> = ({ username }) => {
  const [profilePicUrl, setProfilePicUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const location = useLocation(); // Get the current location

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const db = getFirestore();
        const currentUser = auth.currentUser;

        if (currentUser) {
          const userRef = doc(db, `users/${currentUser.uid}`);
          const docSnap = await getDoc(userRef);

          if (docSnap.exists()) {
            const userData = docSnap.data();
            setProfilePicUrl(userData.profilePic || "");
          } else {
            setProfilePicUrl("");
          }
        } else {
          setProfilePicUrl("");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setProfilePicUrl("");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center w-full h-full">
        <ReactLoading type={"bars"} height={30} width={30} color="black" />
      </div>
    );
  }

  return (
    <div className="w-full flex justify-between px-5 pt-5 lg:px-56 md:px-20">
      <div>
        {location.pathname === "/transaction" ? (
          <h2 className="text-2xl">All Transactions</h2>
        ) : (
          <>
            <h2 className="text-2xl">
              Good{" "}
              {new Date().getHours() < 12
                ? "morning"
                : new Date().getHours() < 18
                ? "afternoon"
                : "evening"}
            </h2>
            <h4 className="text-sm text-cs_yellow opacity-90">
              {username || "Guest"}
            </h4>
          </>
        )}
      </div>
      <Link
        to={"/profile"}
        className="w-[3.4rem] h-[3.4rem] rounded-full p-[2px] border-2 border-cs_yellow"
      >
        <img
          className="p-[1px] rounded-full"
          src={
            profilePicUrl
              ? profilePicUrl
              : "https://avataaars.io/?avatarStyle=Transparent&topType=ShortHairShaggyMullet&accessoriesType=Sunglasses&hairColor=Black&facialHairType=BeardMajestic&facialHairColor=Black&clotheType=BlazerShirt&eyeType=Default&eyebrowType=AngryNatural&mouthType=Serious&skinColor=Light"
          }
        />
      </Link>
    </div>
  );
};

export default Navbar;
