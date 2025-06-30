    
    Returns:
        Rendered template for the home page
    """
    logger.info('Home page accessed')
    return render_template('index.html')

@app.route('/test-portfolio')
def test_portfolio():
    logger.info('Test portfolio page accessed')
    return send_file('test-portfolio.html')

@app.route('/blog')
def blog():
    """Render the blog page"""
    logger.info('Blog page accessed')