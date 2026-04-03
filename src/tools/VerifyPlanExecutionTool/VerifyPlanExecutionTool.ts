export const VerifyPlanExecutionTool = {
  name: "VerifyPlanExecutionTool", isEnabled: () => false, isReadOnly: () => false,
  async call() { return { data: {} }; }, userFacingName() { return "VerifyPlanExecutionTool"; },
  prompt: "", description: "VerifyPlanExecutionTool (stub)",
};
export default VerifyPlanExecutionTool;
