"use client"

import { useCallback, useEffect, useState } from "react"
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import { Switch } from "@/Components/ui/switch"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Eye, EyeOff, Upload } from "lucide-react"
import toast from "react-hot-toast"
import { uploadImageToCloudinary } from "../../utility/uploadImageToCloudinary"
import AxiosRequest from "../../AxiosRequest/AxiosRequest";
import { useSelector } from "react-redux"
import { selectToken } from '../../State/Reducers/tokenSlice';
import { motion } from "framer-motion";


export default function EditProfile() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [avatarUrl, setAvatarUrl] = useState("/placeholder.svg?height=100&width=100")
  const [updatePassword, setUpdatePassword] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isChanged, setIsChanged] = useState(false) // Track changes
  const storedToken = localStorage.getItem('token')
  const token = useSelector(selectToken) || storedToken
  const [loading, setLoading] = useState(false)

  const [initialValues, setInitialValues] = useState({
    name: "",
    email: "",
    avatarUrl: "/placeholder.svg?height=100&width=100",
    updatePassword: false,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Fetch user information
  const fetchUser = useCallback(async () => {
    setLoading(true);
    try {
      const response = await AxiosRequest.get(`/api/get-user-info`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data;
      if (data) {
        setName(data.name || "");
        setEmail(data.email || "");
        setAvatarUrl(data.picture || "/placeholder.svg?height=100&width=100");
        
        // Set initial values to avoid form state issues
        setInitialValues({
          name: data.name || "",
          email: data.email || "",
          avatarUrl: data.picture || "/placeholder.svg?height=100&width=100",
          updatePassword: false,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });

        setIsChanged(false);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // Compare current form values with initial values
  useEffect(() => {
    const isFormChanged =
      (name && name !== initialValues.name) ||
      (email && email !== initialValues.email) ||
      (avatarUrl && avatarUrl !== initialValues.avatarUrl && avatarUrl !== "/placeholder.svg?height=100&width=100") ||
      (updatePassword && newPassword !== "" && confirmPassword !== "");

    setIsChanged(isFormChanged); // Enable button only if any field is changed
  }, [name, email, avatarUrl, updatePassword, newPassword, confirmPassword, initialValues]);

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      console.error("No file selected");
      return;
    }

    try {
      const imageUrl = await uploadImageToCloudinary(file);
      setAvatarUrl(imageUrl);
      console.log("Image URL", imageUrl);
    } catch (error) {
      console.error("Error uploading image to Cloudinary", error);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (updatePassword && newPassword !== confirmPassword) {
      toast.error("New Password and Confirm New Password do not match");
      return;
    }

    const updateData = {
      name: name || undefined, // Send only non-empty values
      email: email || undefined,
      image: avatarUrl !== '/placeholder.svg?height=100&width=100' ? avatarUrl : undefined,
      newPassword: updatePassword ? newPassword : undefined, // Include newPassword only if updatePassword is true
      currentPassword: updatePassword ? currentPassword : undefined, // Include currentPassword only if updatePassword is true
    };

    try {
      const response = await AxiosRequest.put(`/api/self/update`, updateData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Your profile settings have been updated successfully.");
      fetchUser();
    } catch (err) {
      console.error("Failed to update settings", err);
      toast.error(err.response?.data?.message || "An error occurred");
    }
  }

  return (
    <div className="w-full bg-white">
      <div className="min-h-screen flex items-center justify-center min-w-screen">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-lg w-full p-6"
      >
      <Card className="w-full max-w-lg mx-auto shadow-lg shadow-black rounded-lg bg-white transform transition duration-300 hover:-translate-y-2 hover:shadow-3xl">
          <CardHeader>
            <CardTitle className='text-center'>Edit Profile</CardTitle>
            <CardDescription className='text-center'>Manage your profile information and preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex items-center justify-center space-x-4">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={avatarUrl} alt="Profile picture" />
                  <AvatarFallback>
                    {name}
                  </AvatarFallback>
                </Avatar>
                <Label htmlFor="avatar-upload" className="cursor-pointer">
                  <div className="flex items-center space-x-2 bg-secondary text-secondary-foreground px-4 py-2 rounded-md">
                    <Upload size={16} />
                    <span>Upload new image</span>
                  </div>
                  <Input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarUpload}
                  />
                </Label>
              </div>
              <div className="space-y-2">
                <Label htmlFor="firstname">Name</Label>
                <Input
                  id="name"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Your email"
                  value={email}
                  disabled
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="updatePassword">Update Password</Label>
                <Switch
                  id="updatePassword"
                  checked={updatePassword}
                  onCheckedChange={setUpdatePassword}
                />
              </div>
              {updatePassword && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <div className="relative">
                    <Input
                    id="currentPassword"
                    name="current-password-dummy-do-not-autocomplete"
                    type={showCurrentPassword ? "text" : "password"}
                    placeholder="Enter current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    autoComplete="new-password"
                    aria-autocomplete="none"
                  />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      >
                        {showCurrentPassword ? <EyeOff /> : <Eye />}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? <EyeOff /> : <Eye />}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff /> : <Eye />}
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </form>
          </CardContent>
          <CardFooter>
        <Button onClick={handleSubmit} disabled={!isChanged} className="ml-auto">Save Changes</Button>
      </CardFooter>
        </Card>
        </motion.div>
      </div>
    </div>
  )
}
