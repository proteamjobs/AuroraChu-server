const getEnvUrl = () => {
  if (process.env.NODE_ENV === "development") {
    return "wake-up-file-server";
  } else if (process.env.NODE_ENV === "production") {
    return "wake-up-file-server-production";
  }
};

module.exports = getEnvUrl;
