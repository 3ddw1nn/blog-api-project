import { Request, Response, NextFunction } from "express";

const verifyRoles = (...allowedRoles: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req?.user?.roles) return res.sendStatus(401);
    const rolesArray = [...allowedRoles];
    console.log(rolesArray);
    console.log(req.user.roles);
    const result = req.user.roles
      .map((role) => rolesArray.includes(role))
      .find((val: boolean) => val === true);
    if (!result) return res.sendStatus(401);
    next();
    return;
  };
};

export default verifyRoles;
