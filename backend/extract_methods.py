import ast
tree = ast.parse(open('src/api/Components/admin_component.py', encoding='utf-8').read())
classes = [node for node in tree.body if isinstance(node, ast.ClassDef)]
for cls in classes:
    for node in cls.body:
        if isinstance(node, ast.FunctionDef):
            print(f"Function: {node.name}")
