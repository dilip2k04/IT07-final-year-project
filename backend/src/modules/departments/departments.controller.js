import * as service from "./departments.service.js";

export const list = async (req,res)=>res.json(await service.list());
export const create = async (req,res)=>res.json(await service.create(req.body));
export const update = async (req,res)=>res.json(await service.update(req.params.id,req.body));
export const remove = async (req,res)=>res.json(await service.remove(req.params.id));
