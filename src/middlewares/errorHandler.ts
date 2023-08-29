const errorHandler = (err: any, _: any, res: any, __: any) => {
  const status = err.status || 500;
  if (status === 500) {
    console.error(err.stack || "");
  }
  res.status(status).json({
    data: null,
    error: {
      message: err.message || "Internal Server Error",
    },
  });
};

export default errorHandler;
