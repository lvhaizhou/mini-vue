import { NodeTypes } from "./ast"

export function generate(ast) {
  const context = createCodegenContext()
  const { push } = context

  genFunctionPreamble(ast, context)

  const functionName = 'render'
  const args = ["_ctx", "_cache"]
  const signature = args.join(", ")

  push(`function ${functionName}(${signature}){`)

  push('return ')
  genNode(ast.codegenNode, context)
  push("}")

  return {
    code: context.code
  }
}

function genFunctionPreamble(ast, context) {
  const { push } = context
  const VueBinging = "Vue"
  const aliasHelper = s => `${s}: _${s}`
  if (ast.helpers.length > 0) {
    push(`const { ${ast.helpers.map(aliasHelper).join(", ")} } = ${VueBinging}`)
    push("\n")
  }
  push("return ")
}

function genNode(node: any, context) {
  switch (node.type) {
    case NodeTypes.TEXT:
      genText(node, context)
      break;
    case NodeTypes.INTERPOLATION:
      genInterpolation(node, context)
      break;
    case NodeTypes.SIMPLE_EXORESSION:
      genExpression(node, context)
      break;

    default:
      break;
  }


}
function genText(node: any, context: any) {
  const { push } = context
  push(`'${node.content}'`)
}

function createCodegenContext() {
  const context = {
    code: "",
    push(source) {
      context.code += source
    }
  }
  return context
}

function genInterpolation(node: any, context: any) {
  const { push } = context
  push(`_toDisplayString(`)
  genNode(node.content, context)
  push(")")
}

function genExpression(node: any, context: any) {
  const { push } = context
  push(`${node.content}`)
}

