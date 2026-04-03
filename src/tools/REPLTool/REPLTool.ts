export const REPLTool = {
  name: "REPLTool", isEnabled: () => false, isReadOnly: () => false,
  async call() { return { data: {} }; }, userFacingName() { return "REPLTool"; },
  prompt: "", description: "REPLTool (stub)",
};
export default REPLTool;
