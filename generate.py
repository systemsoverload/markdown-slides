import markdown2


def generate_docs():
    with open("test.md") as f:
        data = f.read()
    slides = [d.strip() for d in data.split('\n---\n')]

    for slide in slides:
        slide_html = "<slide>\n{}\n</slide>".format(markdown2.markdown(slide, extras=['fenced-code-blocks']))
        print(slide_html)

if __name__ == '__main__':
    generate_docs()
