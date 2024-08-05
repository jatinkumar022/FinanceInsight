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
import { FaEye } from "react-icons/fa";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
    width: window.innerWidth < 768 ? 180 : 300, // Smaller width for mobile
    height: window.innerWidth < 768 ? 180 : 300, // Smaller height for mobile
  });

  function toScientificNotation(num: any) {
    const numStr = num.toString();
    // Convert to scientific notation only if the length of the number string is greater than 22
    return numStr.length > 22 ? num.toExponential(2) : numStr;
  }

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
      setCroppedImage(null); // Reset cropped image on new upload
      setCropperOpen(true);
    }
  };

  const handleCropComplete = async (
    croppedArea: any,
    croppedAreaPixels: any
  ): Promise<void> => {
    try {
      // Log the croppedAreaPixels to debug

      const croppedImg = await getCroppedImg(image!, croppedAreaPixels);
      setCroppedImage(croppedImg);
    } catch (error) {
      console.error("Error cropping image:", error);
    }
  };

  const handleUpload = async (): Promise<void> => {
    if (!croppedImage || !user) return;

    try {
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
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        variant: "destructive",
        title: "Failed to upload profile picture",
      });
    }
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
                    profilePicUrl
                      ? profilePicUrl
                      : "https://avataaars.io/?avatarStyle=Transparent&topType=ShortHairShaggyMullet&accessoriesType=Sunglasses&hairColor=Black&facialHairType=BeardMajestic&facialHairColor=Black&clotheType=BlazerShirt&eyeType=Default&eyebrowType=AngryNatural&mouthType=Serious&skinColor=Light"
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
          <div className="relative">
            <img
              src={Card}
              alt="Card"
              className="rounded-xl w-full max-w-[320px] h-auto"
            />
            <div className="absolute top-12 left-44  transform -translate-x-1/2 text-white text-center">
              <div className="text-xs cursor-default">
                Click to check Balance
              </div>
              <div className="text-3xl overflow-hidden whitespace-nowrap text-ellipsis max-w-[150px]">
                {/* Display balance, limited to 8 characters */}
                {/* {`₹${balance}} */}
                <div className="  p-1 text-center w-max mt-2 cursor-pointer bg-slate-900 rounded-full focus:animate-out ">
                  {}

                  <Dialog>
                    <DialogTrigger asChild>
                      <FaEye size={20} />
                    </DialogTrigger>
                    <DialogContent className=" w-max ">
                      <DialogHeader>
                        <DialogTitle>Your Current Balance:</DialogTitle>
                      </DialogHeader>
                      <div className="flex items-center space-x-2">
                        <div className="grid flex-1 gap-2">
                          <div className="w-full text-2xl p-2">
                            {toScientificNotation(balance)}
                          </div>
                        </div>
                      </div>
                      <DialogFooter className="sm:justify-start">
                        <DialogClose asChild>
                          <Button type="button" variant="secondary">
                            Close
                          </Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
            <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 text-white text-center">
              <div className="text-sm truncate">
                {user?.displayName || "User Name"}
              </div>
            </div>
          </div>
        </div>

        <div className="mb-16  m-5 p-10 flex items-center justify-center">
          {user && (
            <button
              className="flex gap-1 items-center text-red-600"
              onClick={logoutFnc}
            >
              <CgLogOut size={"1.5rem"} className="mt-[1px]" /> Logout
            </button>
          )}
        </div>

        {/* Cropper Modal */}
        {cropperOpen && (
          <div className="fixed inset-0 mb-20 bg-black bg-opacity-50 flex items-center justify-center">
            <div
              className="relative bg-white p-4 rounded-lg"
              style={{
                width: cropperSize.width + 30,
                height: cropperSize.height + 80,
              }}
            >
              <div
                style={{ width: cropperSize.width, height: cropperSize.height }}
              >
                {image && (
                  <Cropper
                    image={image}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={handleCropComplete}
                  />
                )}
              </div>
              <div className="absolute  inset-x-0 -bottom-14  flex gap-2 items-center px-4">
                <button
                  className="bg-gray-500 text-white py-2 px-2 rounded-md w-full"
                  onClick={() => setCropperOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-yellow-400 text-white py-2 px-2 rounded-md w-full"
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
