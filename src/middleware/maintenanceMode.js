const maintenanceMode = (req, res, next, maintenanceMode = false) => {
  if (maintenanceMode) {
    res.status(503).send('The server is down for maintenance, please try again later');
  } else {
    next();
  }
};

module.exports = maintenanceMode;