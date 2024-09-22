import * as Yup from "yup";
import { object, string, ref } from "yup";

const WorkSpaceValudation = Yup.object({
    Title: Yup.string()
    .required('Title is required')
    .min(3)
    .max(64),
  Description: Yup.string()
    .max(256)
});

export default WorkSpaceValudation;