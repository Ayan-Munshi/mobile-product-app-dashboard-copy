import Avatar from "react-avatar";

type UserProfileProps = {
  firstName: string;
  lastName?: string;
  profilePic?: string;
  size?: string;
  fontSize?: number;
  showFullName?: boolean;
  round?: boolean;
};

const UserProfile: React.FC<UserProfileProps> = ({
  firstName,
  lastName,
  profilePic,
  size,
  round = true,
  fontSize,
  showFullName = true,
}) => {
  const fullName = `${firstName ? firstName : ""} ${lastName ? lastName : ""}`;

  return (
    <div className="flex items-center">
      <Avatar
        round={round}
        size={size}
        textSizeRatio={fontSize}
        src={profilePic || ""}
        name={profilePic ? "" : fullName}
        className="font-sans object-contain"
      />
      {showFullName && <p className="ml-2">{fullName}</p>}
    </div>
  );
};

export default UserProfile;
