package com.bwsy.todolist.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.bwsy.todolist.dto.post.PostDTO;
import com.bwsy.todolist.mapper.PostMapper;
import com.bwsy.todolist.validation.PostRequest;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PostService {

    private final PostMapper postMapper;

    public List<PostDTO> findPosts(String category, String keyword) {
        return postMapper.findPosts(category, keyword);
    }

    @Transactional
    public void createPost(Long loginUserId, PostRequest request) {
        postMapper.insertPost(loginUserId, request);
    }

    @Transactional
    public PostDTO findPost(Long postId) {
        PostDTO post = postMapper.findPostById(postId);

        if (post == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "게시글을 찾을 수 없습니다.");
        }
        
        postMapper.increaseViewCount(postId);

        return postMapper.findPostById(postId);
    }

    @Transactional
    public void updatePost(Long postId, Long loginUserId, PostRequest request) {
        PostDTO post = postMapper.findPostById(postId);

        if (post == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "게시글을 찾을 수 없습니다.");
        }

        if (!post.getUserId().equals(loginUserId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "게시글 작성자만 수정할 수 있습니다.");
        }

        postMapper.updatePost(postId, loginUserId, request);
    }

    @Transactional
    public void deletePost(Long postId, Long loginUserId) {
        PostDTO post = postMapper.findPostById(postId);

        if (post == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "게시글을 찾을 수 없습니다.");
        }

        if (!post.getUserId().equals(loginUserId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "게시글 작성자만 삭제할 수 있습니다.");
        }

        postMapper.softDeletePost(postId, loginUserId);
    }

}
