import React, { useState, useEffect, useRef } from 'react';
import { Box, Paper, Button } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import styled from 'styled-components';

// 容器样式，使用柔和的渐变背景
const Container = styled(Box)`
    display: flex;
    height: 100vh;
    padding: 32px;
    background: linear-gradient(135deg, #eef2f7, #cfd9df);
    font-family: 'Poppins', sans-serif;
`;

// 编辑区和预览区的样式，带有现代化的阴影和圆角效果
const Card = styled(Paper)`
    flex: 1;
    padding: 24px;
    background-color: #ffffff;
    border-radius: 16px;
    box-shadow: 0px 15px 35px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease-in-out;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0px 20px 40px rgba(0, 0, 0, 0.15);
    }
`;

const ScrollableContent = styled(Box)`
    flex: 1;
    overflow-y: auto;
    margin-top: 16px;
    padding-right: 8px; /* 增加内边距，防止滚动条遮挡内容 */
`;

const MarkdownTextArea = styled.textarea`
    width: 100%;
    height: 100%;
    border: none;
    outline: none;
    resize: none;
    font-family: 'Roboto Mono', monospace;
    font-size: 1rem;
    color: #333;
    background-color: #f9fafc;
    padding: 16px;
    border-radius: 12px;
    box-shadow: inset 0px 2px 4px rgba(0, 0, 0, 0.05);
    transition: background-color 0.3s ease;

    &:focus {
        background-color: #e0f7fa;
    }
`;

const StyledMarkdown = styled(ReactMarkdown)`
    h1 {
        color: #333;
        margin-bottom: 24px;
        font-weight: 700;
        font-size: 2.5rem;
        position: relative;
        padding-bottom: 8px;
        padding-left: 16px;
        background: linear-gradient(to right, #1976d2, #4fc3f7);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        transition: all 0.3s ease;
    }

    h2 {
        color: #444;
        margin-bottom: 20px;
        font-weight: 600;
        font-size: 2rem;
        position: relative;
        padding-bottom: 6px;
        padding-left: 14px;
        background: linear-gradient(to right, #388e3c, #81c784);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        transition: all 0.3s ease;
    }

    h3 {
        color: #555;
        margin-bottom: 18px;
        font-weight: 500;
        font-size: 1.75rem;
        position: relative;
        padding-bottom: 4px;
        padding-left: 12px;
        background: linear-gradient(to right, #fbc02d, #ffeb3b);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        transition: all 0.3s ease;
    }

    h4 {
        color: #666;
        margin-bottom: 16px;
        font-weight: 500;
        font-size: 1.5rem;
        position: relative;
        padding-bottom: 4px;
        padding-left: 10px;
        background: linear-gradient(to right, #6a1b9a, #ba68c8);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        transition: all 0.3s ease;
    }

    h5 {
        color: #777;
        margin-bottom: 14px;
        font-weight: 500;
        font-size: 1.25rem;
        position: relative;
        padding-bottom: 4px;
        padding-left: 8px;
        background: linear-gradient(to right, #00796b, #4db6ac);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        transition: all 0.3s ease;
    }

    p {
        font-size: 1.1rem;
        line-height: 1.8;
        color: #555;
        margin-bottom: 20px;
        transition: color 0.3s ease;
    }

    code {
        background-color: #f5f5f5;
        padding: 4px 8px;
        border-radius: 6px;
        font-family: 'Roboto Mono', monospace;
        transition: background-color 0.3s ease;
    }

    pre {
        background-color: #2d2d2d;
        padding: 20px;
        border-radius: 12px;
        overflow-x: auto;
        color: #f8f8f2;
        margin-bottom: 24px;
        font-family: 'Roboto Mono', monospace;
        transition: background-color 0.3s ease;
        box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.2);
    }

    blockquote {
        margin: 0;
        padding-left: 16px;
        border-left: 4px solid #1976d2;
        color: #555;
        font-style: italic;
        background-color: #f0f4f8;
        border-radius: 8px;
        padding: 20px;
        transition: background-color 0.3s ease;
    }
`;

const StatisticsWrapper = styled(Box)`
    margin-top: 16px;
    padding: 12px;
    background-color: #fafafa;
    border-radius: 12px;
    box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.05);
    font-size: 0.9rem;
    color: #888;
    text-align: right;
`;

const CopyButton = styled(Button)`
    margin-bottom: 16px;
    align-self: flex-start;
    background: linear-gradient(135deg, #1976d2, #4fc3f7);
    color: white;
    padding: 12px 24px;
    border-radius: 50px;
    font-weight: 700;
    text-transform: none;
    box-shadow: 0px 10px 20px rgba(25, 118, 210, 0.4);
    transition: all 0.3s ease-in-out;

    &:hover {
        background: linear-gradient(135deg, #4fc3f7, #1976d2);
        transform: translateY(-3px);
        box-shadow: 0px 15px 30px rgba(25, 118, 210, 0.5);
    }
`;

const MarkdownToRichText = () => {
    const [markdown, setMarkdown] = useState('');
    const [optimizedMarkdown, setOptimizedMarkdown] = useState('');
    const [wordCount, setWordCount] = useState(0);
    const previewRef = useRef(null);

    useEffect(() => {
        const optimizeContent = async (content) => {
            return `${content}\n\n*提示：请确保文章内容简洁明了，以提升用户阅读体验。*`;
        };

        if (markdown) {
            optimizeContent(markdown).then(setOptimizedMarkdown);
            setWordCount(markdown.split(/\s+/).filter((word) => word.length > 0).length);
        } else {
            setOptimizedMarkdown('');
            setWordCount(0);
        }
    }, [markdown]);

    const handleMarkdownChange = (e) => {
        setMarkdown(e.target.value);
    };

    const handleCopyToClipboard = () => {
        const range = document.createRange();
        range.selectNodeContents(previewRef.current);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);

        try {
            document.execCommand('copy');
            alert('富文本已复制到剪贴板！');
        } catch (err) {
            alert('复制失败，请手动复制内容。');
        }

        selection.removeAllRanges(); // 清除选择区域
    };

    return (
        <Container>
            <Card>
                <MarkdownTextArea
                    value={markdown}
                    onChange={handleMarkdownChange}
                    placeholder="输入 Markdown 内容..."
                />
                <StatisticsWrapper>
                    字数: {wordCount}
                </StatisticsWrapper>
            </Card>
            <Card>
                <CopyButton onClick={handleCopyToClipboard}>
                    复制
                </CopyButton>
                <ScrollableContent ref={previewRef}>
                    <StyledMarkdown
                        children={optimizedMarkdown}
                        components={{
                            code({ node, inline, className, children, ...props }) {
                                const match = /language-(\w+)/.exec(className || '');
                                return !inline && match ? (
                                    <SyntaxHighlighter
                                        style={materialDark}
                                        language={match[1]}
                                        PreTag="div"
                                        {...props}
                                    >
                                        {String(children).replace(/\n$/, '')}
                                    </SyntaxHighlighter>
                                ) : (
                                    <code className={className} {...props}>
                                        {children}
                                    </code>
                                );
                            },
                        }}
                    />
                </ScrollableContent>
            </Card>
        </Container>
    );
};

export default MarkdownToRichText;
