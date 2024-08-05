import React, { useEffect, useState, ChangeEvent } from "react";
import Card from "../assets/card.png";
import { CgLogOut } from "react-icons/cg";
import { toast } from "@/components/ui/use-toast";
import { signOut } from "firebase/auth";
import { auth } from "@/db/firebase";
import { useNavigate } from "react-router-dom";
import useTransactionStore from "@/store/transactionStore";
import { useAuthState } from "react-firebase-hooks/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestore, doc, updateDoc, getDoc } from "firebase/firestore";
import { PlusIcon } from "lucide-react";
import Cropper from "react-easy-crop";
import getCroppedImg from "@/components/ui/cropImage"; // Utility function for cropping

interface UserProfile {
  profilePic?: string;
}

const Profile: React.FC = () => {
  const [user] = useAuthState(auth);
  const { balance, fetchTransactions } = useTransactionStore();
  const [image, setImage] = useState<string | null>(null);
  const [profilePicUrl, setProfilePicUrl] = useState<string>("");
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const [cropperOpen, setCropperOpen] = useState<boolean>(false);
  const [cropperSize] = useState<{
    width: number;
    height: number;
  }>({
    width: 500,
    height: 500,
  });

  useEffect(() => {
    if (user) {
      fetchTransactions(user.uid);
      const fetchProfilePic = async () => {
        const db = getFirestore();
        const userRef = doc(db, `users/${user.uid}`);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          const data = docSnap.data() as UserProfile;
          setProfilePicUrl(data.profilePic || "");
        }
      };
      fetchProfilePic();
    }
  }, [user, fetchTransactions]);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>): void => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setImage(URL.createObjectURL(file));
      setCropperOpen(true);
    }
  };

  const handleCropComplete = async (croppedAreaPixels: any): Promise<void> => {
    try {
      const croppedImg = await getCroppedImg(image!, croppedAreaPixels);
      setCroppedImage(croppedImg);
    } catch (error) {
      console.error("Error cropping image:", error);
    }
  };

  const handleUpload = async (): Promise<void> => {
    if (!croppedImage || !user) return;

    const storage = getStorage();
    const storageRef = ref(
      storage,
      `profile-pics/${user.uid}/${Date.now()}.jpg`
    );

    // Convert base64 to Blob
    const response = await fetch(croppedImage);
    const blob = await response.blob();

    // Upload the file
    await uploadBytes(storageRef, blob);

    // Get the download URL
    const downloadURL = await getDownloadURL(storageRef);
    setProfilePicUrl(downloadURL);

    // Update Firestore with the new profile picture URL
    const db = getFirestore();
    const userRef = doc(db, `users/${user.uid}`);
    await updateDoc(userRef, { profilePic: downloadURL });

    toast({ variant: "success", title: "Profile picture updated!" });
    setCropperOpen(false);
  };

  const navigate = useNavigate();

  const logoutFnc = async (): Promise<void> => {
    try {
      await signOut(auth);
      toast({ variant: "success", title: "Logged out successfully!" });
      navigate("/login");
    } catch (error) {
      toast({ variant: "destructive", title: (error as Error).message });
    }
  };

  return (
    <div className="flex justify-center h-screen">
      <div className="p-8 flex flex-col justify-around rounded-lg shadow-lg max-w-sm w-full">
        <div>
          <div className="text-center">
            <div className="relative inline-block">
              <div className="relative w-28 h-28 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-yellow-400"></div>
                <img
                  className="w-full p-2 h-full rounded-full border-2 border-yellow-400"
                  src={
                    profilePicUrl ||
                    "https://avataaars.io/?avatarStyle=Transparent&topType=ShortHairShaggyMullet&accessoriesType=Sunglasses&hairColor=Black&facialHairType=BeardMajestic&facialHairColor=Black&clotheType=BlazerShirt&eyeType=Default&eyebrowType=AngryNatural&mouthType=Serious&skinColor=Light"
                  }
                  alt="Profile Image"
                />
                <label
                  htmlFor="file-input"
                  className="absolute bottom-0 right-0 bg-yellow-400 p-1 rounded-full cursor-pointer"
                >
                  <PlusIcon size="24" className="text-white" />
                  <input
                    type="file"
                    id="file-input"
                    style={{ display: "none" }}
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
            </div>
            <h2 className="text-xl font-semibold mt-4">
              {user?.displayName || "User Name"}
            </h2>
            <p className="text-gray-400">{user?.email || "user@example.com"}</p>
          </div>

          <div className="px-4 pt-4 mb-6">Your Current Balance:</div>
          <div className="relative ">
            <img src={Card} alt="Card" className="rounded-xl" />
            <div className="absolute top-12 left-32 text-white">
              <div className="text-xs">Balance</div>
              <div className="text-3xl">₹{balance.toFixed(2)}</div>
            </div>
            <div className="absolute text-sm bottom-5 left-32 text-white">
              <div>{user?.displayName || "User Name"}</div>
            </div>
          </div>
        </div>

        <div className="mb-16 m-5 p-10 flex items-center justify-center">
          {user && (
            <button
              className="flex gap-1 items-center text-red-600"
              onClick={logoutFnc}
            >
              <CgLogOut size={"1.5rem"} className="mt-[1px]" /> Logout
            </button>
          )}
        </div>

        {cropperOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div
              className="bg-white p-4 rounded-lg relative"
              style={{ width: cropperSize.width, height: cropperSize.height }}
            >
              <Cropper
                image={image!}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={handleCropComplete}
              />
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex justify-between w-full px-4">
                <button
                  className="bg-gray-500 text-white p-2 rounded"
                  onClick={() => setCropperOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-blue-500 text-white p-2 rounded"
                  onClick={handleUpload}
                >
                  Upload
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
